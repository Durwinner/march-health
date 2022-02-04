module.exports = async (plugin) => {
  //code
  plugin.controllers.auth.code = async (ctx) => {
    //console.log("ctx", ctx);
    try {
      const { email, password } = ctx?.request?.body;

      const code = Math.floor(10000 + Math.random() * 90000);

      console.log(1, code);
      try {
        //         const user = yield User.findOne({email});

        // console.log(user);
        const emailOptions = {
          to: email,
          subject: "code login",
          html: `<h1>${code}</h1>`,
        };
        await strapi.plugins["email"].services.email.send(emailOptions);
        console.log(`Email sent to ${email}`);
      } catch (err) {
        strapi.log.error(`Error sending email to ${email}`, err);
      }

      // await strapi.plugins[
      //   "users-permissions"
      // ].services.user.sendConfirmationEmail(user);
      console.log("code", code);

      // console.log(email, password);
      const data = {
        success: true,
        code,
      };
      ctx.send(data);
    } catch (error) {
      console.log(error);
      ctx.response.status = 500;
      ctx.response.message = "has error occurd!";
    }
  };

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/code",
    handler: "auth.code",
    config: {
      prefix: "",
    },
  });

  //login
  plugin.controllers.auth.login = (ctx) => {
    console.log("login");
  };

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/login",
    handler: "auth.login",
    config: {
      prefix: "",
    },
  });

  return plugin;
};
