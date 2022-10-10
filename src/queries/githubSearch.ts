import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query getRepositories($query: String!) {
    search(type: REPOSITORY, query: $query, first: 25) {
      edges {
        node {
          ... on Repository {
            name
            url
            description
            stargazerCount
            licenseInfo {
              name
            }
          }
        }
      }
      repositoryCount
      userCount
    }
  }
`;
