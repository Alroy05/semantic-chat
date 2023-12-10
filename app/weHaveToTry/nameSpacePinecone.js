// First, set up some records. In a real use case, the vector values in these records would probably be outputs of an embedding model.
const records = [{
    id: 'id-1',
    values: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
 }]

// Calling upsert on the 'nsA' client instance upserts to the namespace 'namespace_a'.
const nsA = index.namespace('namespace_a')
await nsA.upsert(recordsA);

// If we perform another operation like fetch with this client instance, it will also execute within the namespace 'namespace_a' and the record should be found and returned.
const fetchResult = await nsA.fetch([ 'id-1' ])
console.log(fetchResult.records['id-1'] !== undefined) // true
console.log(fetchResult.namespace === 'namespace_a') // true

// If we execute the same command with the client instance scoped to a different namespace, such as `namespace_b`, then no records should be found by fetch when looking for the id `id-1`.
const fetchResult2 = await index.namespace('namespace_b').fetch(['id-1'])
console.log(fetchResult2.records['id-1'] !== undefined) // false because no data returned by fetch