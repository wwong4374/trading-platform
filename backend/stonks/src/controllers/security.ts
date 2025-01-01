import express, { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import * as Security from '../models/security';

export const router = express.Router({ mergeParams: true });

interface GetSecurityByIdParams extends ParamsDictionary {
  id: string;
}
interface GetSecurityByTickerParams extends ParamsDictionary {
  ticker: string;
}

async function getAllSecurities(res: Response) {
  try {
    const securities = await Security.findAll();
    res.json(securities);
  } catch (error) {
    console.error('Error getting all securities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getSecurityById(
  req: Request<GetSecurityByIdParams>,
  res: Response
) {
  try {
    const security = await Security.findMaybeOneById(req.params.id);
    if (!security) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(security);
  } catch (error) {
    console.error('Error getting security:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getSecurityByTicker(
  req: Request<GetSecurityByTickerParams>,
  res: Response
) {
  try {
    const security = await Security.findMaybeOneByTicker(req.params.ticker);
    if (!security) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(security);
  } catch (error) {
    console.error('Error getting security:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getSecurityWithPricesByTicker(
  req: Request<GetSecurityByTickerParams>,
  res: Response
) {
  try {
    const securityWithPrices = await Security.findOneWithPricesByTicker(
      req.params.ticker
    );
    res.json(securityWithPrices);
  } catch (error) {
    console.error('Error getting security with prices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createSecurity(
  req: Request<object, object, Security.BaseSecurity>,
  res: Response
) {
  try {
    const security = await Security.insert(req.body);
    res.status(201).json(security);
  } catch (error) {
    console.error('Error creating security:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

router.get('/', getAllSecurities);
router.get('/:id', getSecurityById);
router.get('/ticker/:ticker', getSecurityByTicker);
router.get('/ticker/:ticker/prices', getSecurityWithPricesByTicker);
router.post('/', createSecurity);
