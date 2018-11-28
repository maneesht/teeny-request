import * as assert from 'assert';
import * as r from 'request';
import {teenyRequest} from '../src';
import * as nock from 'nock';

nock('http://www.example.com')
  .persist()
  .get('/')
  .reply(403, 'Denied', {
    'X-Example-Header': 'test-header-value',
  });

describe('teeny', () => {
  it('should get JSON', (done) => {
    teenyRequest(
        {uri: 'https://jsonplaceholder.typicode.com/todos/1'},
        (error, response, body) => {
          assert.ifError(error);
          assert.strictEqual(response!.statusCode, 200);
          assert.notEqual(body!.userId, null);
          done();
        });
  });

  it('should set defaults', (done) => {
    const defaultRequest = teenyRequest.defaults({timeout: 60000} as r.Options);
    defaultRequest(
        {uri: 'https://jsonplaceholder.typicode.com/todos/1'},
        (error, response, body) => {
          assert.ifError(error);
          assert.strictEqual(response!.statusCode, 200);
          assert.notEqual(body!.userId, null);
          done();
        });
  });

  it('response event emits object compatible with request module', done => {
    const reqStream = teenyRequest({uri: 'http://www.example.com'})
    reqStream.on('response', (message) => {
      assert.equal(403, message.statusCode);
      assert.equal('test-header-value', message.header['x-example-header']);
      reqStream.on('end', done);
    });
  });
});
