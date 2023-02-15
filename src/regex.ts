// password deve ter entre 4 e 8 dígitos e incluir pelo menos um dígito numérico
export const passwordRegex = /^(?=.*\d).{4,8}$/;

// email deve ter formato de email
export const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;