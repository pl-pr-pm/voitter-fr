const usernameValidation = (username: string) => {
  if (!username) {
    return "文字を入力してください";
  }
  const usernameRegExp = /^[a-zA-Z0-9]*$/;
  if (!(username.length >= 4 && username.length <= 50)) {
    return "長さが不正です。4文字以上50文字以下としてください";
  }
  if (!username.match(usernameRegExp)) {
    return "書式が不正です。半角英数字のみとしてください";
  }
  return "";
};

const passwordValidation = (password: string) => {
  if (!password) {
    return "文字を入力してください";
  }
  const passwordRegExp = /^[a-zA-Z0-9@#,]*$/;
  if (!(password.length >= 8 && password.length <= 16)) {
    return "長さが不正です。8文字以上16文字以下としてください";
  }
  if (!password.match(passwordRegExp)) {
    return "書式が不正です。半角英数字記号としてください。記号は@#,のみ。";
  }
  return "";
};

export const validationInput = (key: string, target: string) => {
  if (!target) return "文字を入力してください";
  switch (key) {
    case "username":
      return usernameValidation(target);
    case "password":
      return passwordValidation(target);
  }
};
