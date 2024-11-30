import type { Metadata } from 'next';
import { AppearanceType } from '#/types';
import { notFound } from 'next/navigation';
import CollectId from '#/app/collect/[id]/CollectId';
import { getOrganization } from '#/lib/graphql/queries';

export const metadata: Metadata = {
	title: 'Collect Feedback - ENGIS Portal',
	description: '...'
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async (props: PageProps) => {
  const params = await props.params;

  const organization = await getOrganization({ organizationId: params.id });
  if (!organization) {
    return notFound();
  }

  const widgetStyle = JSON.parse(`{${organization.widgetStyle}}`) as AppearanceType;

  return <CollectId params={params} widgetStyle={widgetStyle} />;
};

export default Page;
