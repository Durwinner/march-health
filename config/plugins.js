module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "strapi-provider-email-sendinblue",
      providerOptions: {
        sendinblue_api_key: env(
          "SIB_API_KEY",
          "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"
        ),
        sendinblue_default_replyto: env(
          "SIB_DEFAULT_REPLY_TO",
          "ahmadghasemi1403@gmail.com"
        ),
        sendinblue_default_from: env(
          "SIB_DEFAULT_FROM",
          "ahmadghasemi1403@gmail.com"
        ),
        sendinblue_default_from_name: env(
          "SIB_DEFAULT_FROM_NAME",
          "teststrapi"
        ),
      },
    },
  },
});
