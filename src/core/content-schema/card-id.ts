export const RECOGNITION_TEMPLATE_ID = 'recognition';

type CardIdentity = {
  courseId: string;
  entryId: string;
  templateId?: string;
  senseId: string;
};

export function buildCardId({
  courseId,
  entryId,
  templateId = RECOGNITION_TEMPLATE_ID,
  senseId,
}: CardIdentity): string {
  return [courseId, entryId, templateId, senseId].join(':');
}
