const proxyquire = require('proxyquire');
const _ = require('lodash');

const config = {
  gw2: {
    endpoint: 'https://gw2apis.com/',
  },
};

const axiosGet = sinon.stub();

const gw2Api = proxyquire('./', {
  axios: {
    get: axiosGet,
  },
  '../../../config': config,
});

describe('gw2 api', () => {
  const token = '1234-1234-1234';

  beforeEach(() => axiosGet.reset());

  const stubAxiosGet = (resource, data, id = '') => {
    let endpoint = `${config.gw2.endpoint}v2/${resource}`;
    if (id) {
      endpoint = endpoint.replace('{id}', id);
    }

    axiosGet
      .withArgs(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .returns(Promise.resolve({ data }));
  };

  describe('pvp games', () => {
    it('should read pvp games', () => {
      const data = [1, 2, 3, 4];
      const games = { cool: 'games' };

      stubAxiosGet('pvp/games', data);
      stubAxiosGet(`pvp/games?ids=${data.join(',')}`, games);

      return gw2Api.readPvpGames(token)
        .then((result) => expect(result).to.equal(games));
    });

    it('should not explode if there were no games found', () => {
      const data = [];

      stubAxiosGet('pvp/games', data);

      return gw2Api.readPvpGames(token).then((result) => expect(result).to.equal(data));
    });
  });

  it('should export expected functions', () => {
    expect(gw2Api).to.have.keys([
      'readAccount',
      'readAchievements',
      'readCharacter',
      'readCharacters',
      'readPvpGames',
      'readPvpStandings',
      'readPvpStats',
      'readGuildLogs',
      'readTokenInfo',
      'readTokenInfoWithAccount',
    ]);
  });

  describe('simple calls', () => {
    _.forEach({
      readPvpStandings: { resource: 'pvp/standings' },
      readPvpStats: { resource: 'pvp/stats' },
      readAccount: { resource: 'account', normalise: true },
      readTokenInfo: { resource: 'tokeninfo' },
      readCharacters: { resource: 'characters' },
      readCharacter: { resource: 'characters/{id}', extra: 'Blastrn' },
      readGuildLogs: { resource: 'guild/{id}/log', extra: '1234-1234' },
      readAchievements: { resource: 'account/achievements' },
    }, ({ resource, extra, normalise }, funcName) => {
      it(`should call ${funcName} and resolve data`, () => {
        const data = { some_data: 'data' };
        const normalisedData = { someData: 'data' };

        stubAxiosGet(resource, data, extra);

        return gw2Api[funcName](token, extra)
          .then((result) => expect(result).to.eql(normalise ? normalisedData : data));
      });
    });
  });
});
