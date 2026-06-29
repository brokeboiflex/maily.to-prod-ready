import type { MailyLabels } from './default-labels';
import { defaultLabels } from './default-labels';

// A complete object is accepted.
const complete: MailyLabels = { ...defaultLabels };
void complete;

// An object missing a key fails to type-check, naming the missing key(s).
// @ts-expect-error - missing required label keys
const incomplete: MailyLabels = { 'toolbar.bold': 'Bold' };
void incomplete;
