
var should = require('should');
var AuthService = require('../dist/app/services/business/impl/AuthService');

describe('my first test', function() { 
	it('is running', function() {
		should('test' == 'test').be.ok;
	});
});

describe('AuthServiceTest', ()=> {
	describe('testAuth', ()=> {
		AuthService.default.auth();
	});
})