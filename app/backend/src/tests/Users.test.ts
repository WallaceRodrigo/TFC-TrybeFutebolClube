import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeUser from '../database/models/SequelizeUser';
import { invalidEmail, invalidPassword, unregisteredEmail, unregisteredPassword, userMock, validEmail, validPassword } from './mocks/UserMocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('Login POST EndPoint Test', () => {
  beforeEach(() => {
    sinon.restore();
  })

  describe('Login EndPoint', () => {
    it ('Deve ser possível fazer login com sucesso', async () => {
      const buildUserMock = SequelizeUser.build(userMock);
      sinon.stub(SequelizeUser, 'findOne').resolves(buildUserMock);
  
      const { status, body } = await chai.request(app)
      .post('/login')
      .send({email: validEmail, password: validPassword})
      
      expect(status).to.equal(200);
      expect(body.token).not.to.be.undefined;
    })

    it ('O login não deve permitir o acesso sem informar um email', async () => {
      const buildUserMock = SequelizeUser.build(userMock);
      sinon.stub(SequelizeUser, 'findOne').resolves(buildUserMock);
  
      const { status, body } = await chai.request(app)
      .post('/login')
      .send({ password: validPassword });
  
      expect(status).to.equal(400);
      expect(body).to.be.deep.equal({ message: "All fields must be filled" });
    })
    
    it ('O login não deve permitir o acesso sem informar uma senha', async () => {
      const buildUserMock = SequelizeUser.build(userMock);
      sinon.stub(SequelizeUser, 'findOne').resolves(buildUserMock);
  
      const { status, body } = await chai.request(app)
      .post('/login')
      .send({ email: validEmail });
  
      expect(status).to.equal(400);
      expect(body).to.be.deep.equal({ message: "All fields must be filled" });
    })

    it ('O login não deve permitir o acesso com um email não registrado', async () => {
      sinon.stub(SequelizeUser, 'findOne').resolves(null);
  
      const { status, body } = await chai.request(app)
      .post('/login')
      .send({ email: unregisteredEmail, password: validPassword });
  
      expect(status).to.equal(401);
      expect(body).to.be.deep.equal({ message: "Invalid email or password" });
    })
    
    it ('O login não deve permitir o acesso com um senha não registrado', async () => {
      const buildUserMock = SequelizeUser.build(userMock);
      sinon.stub(SequelizeUser, 'findOne').resolves(buildUserMock);
  
      const { status, body } = await chai.request(app)
      .post('/login')
      .send({ email: validEmail, password: unregisteredPassword });
  
      expect(status).to.equal(401);
      expect(body).to.be.deep.equal({ message: "Invalid email or password" });
    })

    it ('O login não deve permitir o acesso com um email invalido', async () => {
      sinon.stub(SequelizeUser, 'findOne').resolves(null);
  
      const { status, body } = await chai.request(app)
      .post('/login')
      .send({ email: invalidEmail, password: validPassword });
  
      expect(status).to.equal(401);
      expect(body).to.be.deep.equal({ message: "Invalid email or password" });
    })
    
    it ('O login não deve permitir o acesso com um senha invalida', async () => {
      const buildUserMock = SequelizeUser.build(userMock);
      sinon.stub(SequelizeUser, 'findOne').resolves(buildUserMock);
  
      const { status, body } = await chai.request(app)
      .post('/login')
      .send({ email: validEmail, password: invalidPassword });
  
      expect(status).to.equal(401);
      expect(body).to.be.deep.equal({ message: "Invalid email or password" });
    })
  })
});
