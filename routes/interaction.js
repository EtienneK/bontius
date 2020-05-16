const { json, Router } = require('express');
const { Validator, ValidationError } = require('express-json-validator-middleware');
const { register } = require('../schemas/interaction');
const oidcProvider = require('../providers/oidc.provider');

const router = Router();
router.use(json());

const validator = new Validator({ allErrors: true });

const uidPath = '/:uid';

router.all(uidPath, async (req, res, next) => {
  try {
    req.interaction = await oidcProvider.interactionDetails(req, res);
    next();
  } catch (err) {
    next(err);
  }
});

router.get(uidPath, (req, res) => {
  switch (req.interaction.prompt.name) {
    case 'register': return res.json(register);
    default: return undefined;
  }
});

router.post(uidPath, async (req, res, next) => {
  switch (req.interaction.prompt.name) {
    case 'register':
      return validator.validate({ body: register })(req, res, (err) => {
        if (err) return next(err);
        return res.json('done');
      });
    default: return undefined;
  }
});

module.exports = router;
