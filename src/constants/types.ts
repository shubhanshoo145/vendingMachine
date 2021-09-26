export default {
  // Config
  Config: Symbol.for('Config'),

  // Application bootstrap
  Application: Symbol.for('Application'),
  MongooseService: Symbol.for('MongooseService'),
  HttpService: Symbol.for('HttpService'),
  HttpRouter: Symbol.for('HttpRouter'),

  // Middleware
  BasicMiddleware: Symbol.for('BasicMiddleware'),
  ErrorMiddleware: Symbol.for('ErrorMiddleware'),

  // Logging
  LoggerService: Symbol.for('LoggerService'),

  // Accounts
  AccountService: Symbol.for('AccountService'),
  AccountRepository: Symbol.for('AccountRepository'),
  AccountModel: Symbol.for('AccountModel'),

  // Transactions
  TransactionModel: Symbol.for('TransactionModel'),
  TransactionRepository: Symbol.for('TransactionRepository'),
  TransactionService: Symbol.for('TransactionService'),

  PasswordHasher: Symbol.for('PasswordHasher'),

  // Products
  ProductModel: Symbol.for('ProductModel'),
  ProductRepository: Symbol.for('ProductRepository'),
  ProductService: Symbol.for('ProductService'),
};
