import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import style from './App.module.css';
import { Card, Input, LoadingIcon } from './components/';
import { GET_REPOSITORIES } from './queries/githubSearch';

const App = () => {
  const [executeSearch, { loading, error, data }] = useLazyQuery(GET_REPOSITORIES);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [queryError, setQueryError] = React.useState('');
  let loadedQueryParams = false;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /**
   * Uses regular expressions to test the text input. Sets appropriate errors if needed.
   * @param {string} queryString User's search input
   * @returns {boolean} True/False
   */
  const testQuery = (queryString: string) => {
    const regex = new RegExp(
      /^(?:(user:\w+ *)| *(stars:(([0-9]+\.\.[0-9]+)|([0-9]+))) *)*$/g,
    );
    const regexStars = /(stars:(([0-9]\.\.[0-9]+)|([0-9]+)))($| )/g;

    if (regex.test(queryString)) {
      let user = queryString.match(/(user:\w+ *)/g)?.toString();
      let stars = queryString.match(regexStars)?.toString();

      if (user) user = user.replace('user:', '').replace(' ', '');
      if (stars) stars = stars.replace('stars:', '').replace(' ', '');

      setQueryError('');
      regex.lastIndex = 0;
      if (searchParams.get('user') != user && searchParams.get('stars') != stars) {
        user = user ? 'user=' + user + (stars ? '&' : '') : '';
        stars = stars ? 'stars=' + stars : '';
        navigate({
          pathname: '',
          search: '?' + user + stars,
        });
      }
      return true;
    }

    if (/stars:/g.test(queryString) && !regexStars.test(queryString)) {
      setQueryError(
        'To search by stargazers use "stars:<number> or "<number>..<number>" for a range.',
      );
      return false;
    }

    setQueryError(
      "Please use the 'user:<username>' and/or 'stars:<number>..<number>' search format.",
    );
    return false;
  };

  /**
   * Runs the query against the API if the tests pass.
   * @param {event} e A form event.
   * @param {string} queryString User's search input.
   * @returns null
   */
  const runSearch = (e?: React.FormEvent<HTMLFormElement>, queryString?: string) => {
    if (e) e.preventDefault();
    if (queryString && testQuery(queryString))
      executeSearch({
        fetchPolicy: 'cache-and-network',
        variables: { query: queryString },
      });
    return;
  };

  /**
   * If there is data, it returns an array of React Nodes containing cards with the results data.
   * @param {object} data The search results object from the API.
   * @returns {array} An array of <Card /> React nodes.
   */
  const getSearchResults = (data: any) => {
    const results: React.ReactNode[] = [];
    if (data.search.edges.length < 1)
      return <div style={{ textAlign: 'center' }}>No Results</div>;

    Object.keys(data.search.edges).forEach((key: string | number, index: number) =>
      results.push(
        <Card key={`result-${index}`} className={style.result}>
          <div>
            <a
              className={style.repoLink}
              href={data.search.edges[key].node.url}
              target="_blank"
              rel="noreferrer"
            >
              {data.search.edges[key].node.name}
            </a>
            <div className={style.repoDescription}>
              {data.search.edges[key].node.description &&
                data.search.edges[key].node.description}
            </div>
          </div>
          <div className={style.repoDetailBlock}>
            <span className={style.smallCaps}>Stars</span>
            <span className={style.smallText}>
              {data.search.edges[key].node.stargazerCount}
            </span>
          </div>
          <div className={style.repoDetailBlock}>
            <span className={style.smallCaps}>License</span>
            <span className={style.smallText}>
              {data.search.edges[key].node.licenseInfo &&
                data.search.edges[key].node.licenseInfo.name}
            </span>
          </div>
        </Card>,
      ),
    );

    return results;
  };

  React.useEffect(() => {
    if (searchParams.get('user') || searchParams.get('stars')) {
      if (!loadedQueryParams) {
        loadedQueryParams = true;
        runSearch(
          undefined,
          `${searchParams.get('user') ? 'user:' + searchParams.get('user') + ' ' : ''}${
            searchParams.get('stars') ? 'stars:' + searchParams.get('stars') + ' ' : ''
          }`,
        );
      }
    }
  }, []);

  return (
    <div className={style['app-wrapper']}>
      <form
        className={style.searchForm}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          if (inputRef.current && inputRef.current.value != '') {
            runSearch(e, inputRef.current.value);
          } else {
            e.preventDefault();
            setQueryError('Please input a search query.');
          }
        }}
      >
        <label htmlFor="search-input" className={style.inputLabel}>
          Advanced Search:
        </label>
        <Input className={style.searchInput} name="search-input" ref={inputRef} />
      </form>
      {loading && <LoadingIcon />}
      <div className={style.searchResults}>
        <span className={style.searchResultsTitle}>SEARCH results:</span>
        {queryError.length > 0 && <div className={style.syntaxError}>{queryError}</div>}
        {!loading && data && (
          <>
            {error && <div style={{ color: 'red' }}>Error!</div>}
            {data && !queryError && getSearchResults(data)}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
