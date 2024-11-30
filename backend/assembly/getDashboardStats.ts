import { JSON } from 'json-as';
import { postgresql } from '@hypermode/modus-sdk-as';

@json
class Stats {
	stats!: FeedbackStats;
	charts!: FeedbackCharts;
}

@json
class FeedbackStats {
	totalFeedback!: number;
	openFeedback!: number;
	resolvedFeedback!: number;
	averageRating!: number;
	totalFeedbackChange!: number;
	openFeedbackChange!: number;
	resolvedFeedbackChange!: number;
	averageRatingChange!: number;
}

@json
class FeedbackCharts {
	feedbackThisWeek!: Array<FeedbackChartData>;
}

@json
class FeedbackChartData {
	name!: string;
	count!: number;
}

@json
class AllTimeStats {
	totalFeedback!: number;
	openFeedback!: number;
	resolvedFeedback!: number;
	averageRating!: number;
}

@json
class MonthlyStats {
	totalFeedbackCurrentMonth!: number;
	openFeedbackCurrentMonth!: number;
	resolvedFeedbackCurrentMonth!: number;
	averageRatingCurrentMonth!: number;
	totalFeedbackLastMonth!: number;
	openFeedbackLastMonth!: number;
	resolvedFeedbackLastMonth!: number;
	averageRatingLastMonth!: number;
}

@json
class Count {
	count!: number;
}

const calculatePercentageChange = (current: number, previous: number): number => {
	if (!current && !previous) return 0;
	if (!previous) return current > 0 ? 100 : -100;

	return ((current - previous) / previous) * 100;
};

export function getDashboardStats (organizationId: string): Stats {
	const now = Date.now();
	const currentDate = new Date(now);

	// Current Month
	const firstDayOfCurrentMonth = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1, 0, 0, 0, 0);
	const lastDayOfCurrentMonth = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0, 23, 59, 59, 999);

	// Last Month
	const firstDayOfLastMonth = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, 1, 0, 0, 0, 0);
	const lastDayOfLastMonth = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 0, 23, 59, 59, 999);

	// First Day of Current Week (Sunday)
	const firstDayOfCurrentWeek = new Date(now);
	firstDayOfCurrentWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());
	firstDayOfCurrentWeek.setUTCHours(0);

	const feedbackThisWeek: Array<FeedbackChartData> = [];

	// Calculate Weekly Stats
	for (let i = 0; i < 7; i++) {
		const dayStart = new Date(firstDayOfCurrentWeek.getTime() + i * 86400000); // Increment by days in milliseconds
		const dayEnd = new Date(dayStart.getTime() + 86399999); // End of the day

		const query = `
			SELECT COUNT(*)::INTEGER as count
			FROM "Feedback"
			WHERE "organizationId" = '${organizationId}'
			  AND "createdAt" BETWEEN '${dayStart.toISOString()}' AND '${dayEnd.toISOString()}'
		`;

		const result = postgresql.query<Count>('database', query);
		const count = result.rows.length > 0 ? result.rows[0].count || 0 : 0;

		feedbackThisWeek.push({
			name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
			count
		});
	}

	// SQL Queries for All-Time and Monthly Stats
	const statsQuery = `
		SELECT 
			COUNT(*)::INTEGER as "totalFeedback",
			COUNT(*) FILTER (WHERE NOT "isResolved")::INTEGER as "openFeedback",
			COUNT(*) FILTER (WHERE "isResolved")::INTEGER as "resolvedFeedback",
			AVG("rating")::FLOAT as "averageRating"
		FROM "Feedback"
		WHERE "organizationId" = '${organizationId}'
	`;

	const monthlyStatsQuery = `
		SELECT
			COUNT(*) FILTER (WHERE "createdAt" BETWEEN to_timestamp(${firstDayOfCurrentMonth} / 1000) AND to_timestamp(${lastDayOfCurrentMonth} / 1000))::INTEGER as "totalFeedbackCurrentMonth",
			COUNT(*) FILTER (WHERE "createdAt" BETWEEN to_timestamp(${firstDayOfCurrentMonth} / 1000) AND to_timestamp(${lastDayOfCurrentMonth} / 1000) AND NOT "isResolved")::INTEGER as "openFeedbackCurrentMonth",
			COUNT(*) FILTER (WHERE "createdAt" BETWEEN to_timestamp(${firstDayOfCurrentMonth} / 1000) AND to_timestamp(${lastDayOfCurrentMonth} / 1000) AND "isResolved")::INTEGER as "resolvedFeedbackCurrentMonth",
			AVG("rating") FILTER (WHERE "createdAt" BETWEEN to_timestamp(${firstDayOfCurrentMonth} / 1000) AND to_timestamp(${lastDayOfCurrentMonth} / 1000))::FLOAT as "averageRatingCurrentMonth",
			COUNT(*) FILTER (WHERE "createdAt" BETWEEN to_timestamp(${firstDayOfLastMonth} / 1000) AND to_timestamp(${lastDayOfLastMonth} / 1000))::INTEGER as "totalFeedbackLastMonth",
			COUNT(*) FILTER (WHERE "createdAt" BETWEEN to_timestamp(${firstDayOfLastMonth} / 1000) AND to_timestamp(${lastDayOfLastMonth} / 1000) AND NOT "isResolved")::INTEGER as "openFeedbackLastMonth",
			COUNT(*) FILTER (WHERE "createdAt" BETWEEN to_timestamp(${firstDayOfLastMonth} / 1000) AND to_timestamp(${lastDayOfLastMonth} / 1000) AND "isResolved")::INTEGER as "resolvedFeedbackLastMonth",
			AVG("rating") FILTER (WHERE "createdAt" BETWEEN to_timestamp(${firstDayOfLastMonth} / 1000) AND to_timestamp(${lastDayOfLastMonth} / 1000))::FLOAT as "averageRatingLastMonth"
		FROM "Feedback"
		WHERE "organizationId" = '${organizationId}'
	`;

	// Query Execution
	const allTimeStats = postgresql.query<AllTimeStats>('database', statsQuery);
	const monthlyStats = postgresql.query<MonthlyStats>('database', monthlyStatsQuery);

	const stats = allTimeStats.rows[0] || {};
	const monthly = monthlyStats.rows[0] || {};

	// Calculate percentage changes
	const totalFeedbackChange = calculatePercentageChange(monthly.totalFeedbackCurrentMonth || 0, monthly.totalFeedbackLastMonth || 0);
	const openFeedbackChange = calculatePercentageChange(monthly.openFeedbackCurrentMonth || 0, monthly.openFeedbackLastMonth || 0);
	const resolvedFeedbackChange = calculatePercentageChange(monthly.resolvedFeedbackCurrentMonth || 0, monthly.resolvedFeedbackLastMonth || 0);
	const averageRatingChange = calculatePercentageChange(monthly.averageRatingCurrentMonth || 0, monthly.averageRatingLastMonth || 0);

	return {
		stats: {
			totalFeedback: stats.totalFeedback || 0,
			openFeedback: stats.openFeedback || 0,
			resolvedFeedback: stats.resolvedFeedback || 0,
			averageRating: stats.averageRating || 0,
			totalFeedbackChange,
			openFeedbackChange,
			resolvedFeedbackChange,
			averageRatingChange
		},
		charts: {
			feedbackThisWeek
		}
	};
};
