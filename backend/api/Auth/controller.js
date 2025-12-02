import authService from "./service.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginService({ email, password });

    res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const message = await authService.forgotPasswordService(req.body.email);
    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const message = await authService.resetPasswordService(token, password);

    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 const setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(password);
    

    const result = await authService.setPasswordService(email, password);

    return res.json({ success: true, message: result.message });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};


export default { login, forgotPassword, resetPassword ,setPassword};
