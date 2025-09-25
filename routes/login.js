import express from 'express';
import { T10Login } from '../controller/loginController.js';
import {T10Betlist} from '../controller/betlistController.js';
import {getSessionToken,fullFlowMockOrder,integratedBetfairOrder } from '../controller/betfairMock.js';
 const router = express.Router();


router.get('/login', T10Login);
router.get('/betlist', T10Betlist);
router.get('/betfairLogin', getSessionToken);
router.get('/betfairFullFlow', fullFlowMockOrder);
router.post('/betfairIntegratedOrder', integratedBetfairOrder);

export default router;