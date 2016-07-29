import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  graphql
} from 'graphql';
import Query from 'graphql-query-builder';
import head from 'lodash/head';

const populationData = require('./data/population.json');
const populationType = new GraphQLObjectType({
  name: 'Population',
  fields: {
    geo: { type: GraphQLString },
    total: { type: GraphQLInt },
    time: { type: GraphQLInt }
  }
}); 
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      population: {
        type: populationType,
        args: {
          geo: { type: GraphQLString },
          time: { type: GraphQLInt },
        },
        resolve: (_, args) => head(populationData
           .filter(record => record.geo === args.geo && record.time === args.time))
      }
    }
  })
});

const query = new Query('population', {geo: 'afg', time: 1940}).find('total');

graphql(schema, `{${query.toString()}}`)
  .then((result) => {
    console.log(`Population regarding to query "${query.toString()}" is ${result.data.population.total}`);
  });
