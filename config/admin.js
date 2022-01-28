module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'bf25512ea045ddb84773a5aa2d224918'),
  },
});
