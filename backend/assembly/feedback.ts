import { JSON } from 'json-as';
import { Feedback } from './schema';
import { escapeSQL, uuid } from './utils';
import { models, postgresql } from '@hypermode/modus-sdk-as';
import { OpenAIChatModel, SystemMessage, ResponseFormat } from '@hypermode/modus-sdk-as/models/openai/chat';

@json
class ResponseSchema {
  sentiment!: string;
  analysis!: string;

  isValid(): boolean {
    const validSentiments = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];
		if (validSentiments.includes(this.sentiment) && this.analysis.length > 0 === true) {
			return true
		}
		
		return false;
  }

	toString(): string {
		return JSON.stringify(this);
	}
}


export function createFeedback(
  rating: number,
  description: string,
  organizationId: string
): Feedback | null {
	const systemPrompt = `Analyze this feedback and determine its sentiment. Using that analysis, summarize the key issues raised and suggest ways for us, as a company, to address them. Format your response in markdown.
	Feedback: "${description}"

	Here's the JSON response schema: {
		sentiment: 'POSITIVE', // Can also NEUTRAL or NEGATIVE
		analysis: '' // Your analysis & summary goes here
	}`;

	const modelName: string = 'llm';
	const model = models.getModel<OpenAIChatModel>(modelName);
	const input = model.createInput([
    new SystemMessage(systemPrompt)
  ]);

	input.maxTokens = 1250;
	input.temperature = 0;
	input.responseFormat = ResponseFormat.Json;

  const output = model.invoke(input);
	const modelResponse = JSON.parse<ResponseSchema>(output.choices.pop().message.content.trim());
	console.log(`modelResponse :>> ${modelResponse.toString()}`);
	console.log(`modelResponse isValid :>> ${modelResponse.isValid()}`);

	// Insert feedback into the database
	const query = `
		INSERT INTO "Feedback" ("id", "organizationId", "rating", "description", "analysis", "sentiment", "createdAt", "updatedAt")
		VALUES ('${uuid()}', '${organizationId}', ${rating}, '${escapeSQL(description)}', '${escapeSQL(modelResponse.analysis)}', '${modelResponse.sentiment}', NOW(), NOW())
		RETURNING *;
	`;
	
	const result = postgresql.query<Feedback>('database', query);

	if (result.error) {
		console.error(`Error inserting feedback: ${JSON.stringify(result.error)}`);
		return null;
	}

	return result.rows.length ? result.rows.pop() : null;
}

export function getFeedbackByOrganizationIdAndFeedbackId (organizationId: string, feedbackId: string): Feedback | null {
	const fetchedFeedback = postgresql.query<Feedback>(
		'database',
		`SELECT * FROM "Feedback"
			WHERE "organizationId" = '${organizationId}'
			AND "id" = '${feedbackId}'`
	);

	if (fetchedFeedback.error) {
		throw new Error(`Error fetching feedback: ${JSON.stringify(fetchedFeedback.error)}`);
	}

	return fetchedFeedback.rows.length ? fetchedFeedback.rows.pop() : null;
};

export function getFeedbackByFeedbackId (feedbackId: string): Feedback | null {
	const fetchedFeedback = postgresql.query<Feedback>(
		'database',
		`SELECT * FROM "Feedback"
     WHERE "id" = '${feedbackId}'`
	);

	if (fetchedFeedback.error) {
		throw new Error(`Error fetching feedback: ${JSON.stringify(fetchedFeedback.error)}`);
	}

	return fetchedFeedback.rows.length ? fetchedFeedback.rows.pop() : null;
};

export function getFeedbacksByOrganizationId(organizationId: string): Feedback[] {
  const feedbacks = postgresql.query<Feedback>(
    'database',
    `SELECT * FROM "Feedback" WHERE "organizationId" = '${organizationId}' ORDER BY "createdAt" DESC`
  );

  if (feedbacks.error) {
    throw new Error(`Error fetching feedbacks: ${JSON.stringify(feedbacks.error)}`);
  }

  return feedbacks.rows;
};
