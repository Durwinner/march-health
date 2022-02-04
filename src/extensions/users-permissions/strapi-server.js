module.exports = async (plugin) => {
  //code
  plugin.controllers.auth.code = async (ctx) => {
    //console.log("ctx", ctx);
    try {
      const { email, password } = ctx?.request?.body;

      const code = Math.floor(10000 + Math.random() * 90000);

      console.log(1, code);
      // try {
      //   //         const user = yield User.findOne({email});

      //   // console.log(user);
      //   const emailOptions = {
      //     to: email,
      //     subject: "code login",
      //     html: `<h1>${code}</h1>`,
      //   };
      //   await strapi.plugins["email"].services.email.send(emailOptions);
      //   console.log(`Email sent to ${email}`);
      // } catch (err) {
      //   strapi.log.error(`Error sending email to ${email}`, err);
      // }

      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            email: email,
          },
        });

      if (!user) {
        return ctx.badRequest("User does not exist");
      }

      const validPassword = await strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(password, user.password);

      //console.log("validPassword", validPassword);
      if (!validPassword) {
        return ctx.badRequest("Old password does not match.");
      }

      // Update user confirm code
      await strapi
        .query("plugin::users-permissions.user")
        .update({ id: user.id }, { confirmCode: code.toString() });

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
  plugin.controllers.auth.login = async (ctx) => {
    try {
      const { email, password, confirmCode } = ctx?.request?.body;

      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            email: email,
          },
        });
      if (user.confirmCode !== confirmCode) {
      }

      if (!user) {
        return ctx.badRequest("User does not exist");
      }

      const validPassword = await strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(password, user.password);

      //console.log("validPassword", validPassword);
      if (!validPassword) {
        return ctx.badRequest("Old password does not match.");
      }

      const data = {
        success: true,
        token: strapi.plugins[("user", "users-permissions")].services.jwt.issue(
          {
            id: user.id,
          }
        ),
      };
      ctx.send(data);
    } catch (error) {
      console.log("login");
      ctx.badRequest("Something went wrong", { error });
    }
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
