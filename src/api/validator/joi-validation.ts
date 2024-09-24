import Joi, { ObjectSchema, StringSchema, NumberSchema } from "joi";

const options = {
  abortEarly: false,
};

const email = (value: string, helpers: any) => {
  const domain = value.split("@");
  if (domain[1] === `yopmail.com`) {
    return helpers.error("any.invalid");
  }
  return value;
};

const passwordSchema: StringSchema<string> = Joi.string()
  .empty()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
    name: "required",
  })
  .message(
    `Enter a password with minimum one upper case, lower case and number, ranging from 8-15 characters`
  )
  .min(8)
  .max(15)
  .messages({
    "string.base": `Enter a password with minimum one upper case, lower case and number, ranging from 8-15 characters`,
    "string.empty": `Password is required`,
    "string.min": `Password must have a minimum of {#limit} characters`,
    "string.max": `Password can have a maximum of {#limit} characters`,
    "any.required": `Password is required`,
  });

const userTypeSchema: StringSchema<string> = Joi.string()
  .empty()
  .required()
  .max(150).messages({
    "string.base": `userType must be a type of string`,
    "string.empty": `userType is required `,
    "string.max": `userType can have maximum of {#limit} characters`,
    "any.required": `userType is required `,
    "any.optional": `userType is optional `,
  });

const brokerageId: NumberSchema<number> = Joi.number()
  .required()
  .messages({
    "string.base": `brokerageId must be a type of number`,
    "string.empty": `brokerageId is required `,
    "any.required": `brokerageId is required `,
  });

const emailSchema: StringSchema<string> = Joi.string()
  .empty()
  .custom(email, "custom validation")
  .message("Invalid Email")
  .email({ tlds: { allow: true } })
  .max(256)
  .required()
  .messages({
    "string.base": `Enter your email address in format: yourname@example.com`,
    "string.email": `Enter your email address in format: yourname@example.com`,

    "string.empty": `Email is required`,
    "string.min": `Email must have minimum of {#limit} characters`,
    "string.max": `Email can have maximum of {#limit} characters`,
    "any.required": `Email is required`,
    "any.invalid": `Invalid Email`,
  });

const emailPasswordSchema: ObjectSchema = Joi.object()
  .keys({
    email: emailSchema,
    password: passwordSchema,
  })
  .unknown(true);

const registerBrokerSchema: ObjectSchema = Joi.object()
  .keys({
    email: emailSchema,
    password: passwordSchema,
    brokerageId: brokerageId
  })
  .unknown(true);

const emailVerifySchema: ObjectSchema = Joi.object().keys({
  code: Joi.string().empty().messages({
    "string.base": `code must be a type of string`,
    "string.empty": `code is required`,
    "string.min": `code must have minimum of {#limit} characters`,
    "string.max": `code can have maximum  of {#limit} characters`,
    "any.required": `code is required`,
    "any.optional": `code is optional`,
  }),
  email: emailSchema,
});

const emailVerify: ObjectSchema = Joi.object().keys({
  email: emailSchema,
});


const loginSchema: ObjectSchema = Joi.object()
  .keys({
    email: emailSchema,
    userType: userTypeSchema
  })
  .unknown(true);


const registerWithEmailAndPassword = (data: any) => {
  return emailPasswordSchema.validate(data, options);
};
const registerBroker = (data: any) => {
  return registerBrokerSchema.validate(data, options);
};
const tokenVerification = (data: any) => {
  return emailVerifySchema.validate(data, options);
};
const emailVerification = (data: any) => {
  return emailVerify.validate(data, options);
};
const login = (data: any) => {
  return loginSchema.validate(data, options);
};


export {
  registerWithEmailAndPassword,
  registerBroker,
  tokenVerification,
  emailVerification,
  login,
};
