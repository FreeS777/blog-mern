export default ({
  user: { passwordHash, ...userWithoutPassword },
  ...postWithoutPassword
}) => ({
  ...postWithoutPassword,
  user: userWithoutPassword,
});
