const { Provider, interactionPolicy: { Prompt, base: policy } } = require('oidc-provider');
const interactions = policy();

const registerPrompt = new Prompt({
  name: 'register',
  requestable: true,
});

interactions.add(registerPrompt, 0);

const oidcProvider = new Provider('http://localhost:3000', {
  clients: [{
    client_id: 'oidc_client',
    client_secret: 'some_se]cret123',
    redirect_uris: [ 'http://localhost:3000/oidc_redirect' ]
  }],
  features: {
    devInteractions: {
      enabled: false
    }
  },
  interactions: {
    policy: interactions,
    url(ctx, interaction) { // eslint-disable-line no-unused-vars
      return `/interaction/${ctx.oidc.uid}`;
    },
  }
});

module.exports = oidcProvider;
