const getters = {
  token: state => state.user.token,
  info: state => state.user.info,
  theme: state => state.app.theme,
  isMobile: state => state.app.isMobile,
  project_id: state => state.app.project_id,
}
export default getters
