import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
    apiKey: 'your-api-key', 
    environment: 'your-environment',
});
const index = pinecone.index('example-index');

// delete one record by id in default namespace
await index.deleteOne('1')
// delete several records by id in default namespace
await index.deleteMany([ '2', '3', '4' ]);
// delete all records in the default namespace
await index.deleteAll();

// Perform those same operations in a non-default namespace (for paid indexes only)
const ns = index.namespace('example-namespace');
await ns.deleteOne('1');
await ns.deleteMany([ '2', '3', '4' ]);
await ns.deleteAll();