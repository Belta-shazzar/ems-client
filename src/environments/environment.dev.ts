// export const environment = {
//   production: false,
//   authUrl: 'http://localhost:8000/auth-service/api',
//   employeeUrl: 'http://localhost:8000/employee-service/api',
//   wsUrl: 'ws://localhost:8083', // Add WebSocket URL
// };

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  authUrl: 'http://ems-alb-1263798516.eu-west-1.elb.amazonaws.com/auth-service/api',
  employeeUrl: 'http://ems-alb-1263798516.eu-west-1.elb.amazonaws.com/employee-service/api',
  wsUrl: 'ws://localhost:8083'
};