import { type SchemaTypeDefinition } from 'sanity'

import project from './schema/project'
import review from './schema/review'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [project, review],
}
