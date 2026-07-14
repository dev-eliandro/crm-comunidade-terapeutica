// No Express 4, uma rota "async" que lança/rejeita NÃO é capturada
// automaticamente pelo middleware de erro — a exceção escapa sem resposta
// e sem chamar next(error). Esse wrapper garante que qualquer erro dentro
// de um controller assíncrono sempre chegue ao middleware de erro global
// (backend/src/app.js), respondendo com um JSON de erro em vez de travar
// a requisição ou (em casos de rejection não tratada) derrubar o processo.
export function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
