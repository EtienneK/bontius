const { json, Router } = require('express');
const { Validator, ValidationError } = require('express-json-validator-middleware');
const { register } = require('../schemas/interaction');
const oidcProvider = require('../providers/oidc.provider');

const router = Router();
router.use(json());

const validator = new Validator({ allErrors: true });

const uidPath = '/:uid';

function setNoCache(req, res, next) {
  res.set('Pragma', 'no-cache');
  res.set('Cache-Control', 'no-cache, no-store');
  next();
}

function render(req, res) {
  const model = {
    ...register,
    uid: req.interaction.uid
  };
  if (req.get('accept') === 'application/json' || req.get('accept') === 'application/json;charset=utf-8') {
    return res.json(model);
  }
  return res.render('register.ejs', model);
}

router.all(uidPath, setNoCache, async (req, res, next) => {
  try {
    req.interaction = await oidcProvider.interactionDetails(req, res);
    next();
  } catch (err) {
    next(err);
  }
});

router.get(uidPath, (req, res) => {
  switch (req.interaction.prompt.name) {
    case 'register': return render(req, res);
    default: return undefined;
  }
});

router.post(uidPath, async (req, res, next) => {
  switch (req.interaction.prompt.name) {
    case 'register':
      return validator.validate({ body: register.schema })(req, res, (err) => {
        if (err) return next(err);
        return res.json('done');
      });
    default: return undefined;
  }
});

router.get(`${uidPath}/abort`, async (req, res, next) => {
  try {
    const result = {
      error: 'access_denied',
      error_description: 'End-User aborted interaction',
    };
    await oidcProvider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
