import express from 'express';

import * as Security from '../models/security';
import { controller } from './common';

export const router = express.Router({ mergeParams: true });

// TODO: implement
router.get('/:id', getSecurityById());

function getSecurityById() {
  return controller((req) => {
    return Security.findMaybeOneById(req.params.id);
  });
}
