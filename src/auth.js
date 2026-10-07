'use strict';

function authorize(actor, operation) {
  if (!actor || typeof actor.role !== 'string') {
    return { allowed: false, reason: 'unknown-actor' };
  }
  if (actor.role === 'viewer' && operation === 'write') {
    return { allowed: false, reason: 'viewer-cannot-write' };
  }
  return { allowed: true, reason: 'ok' };
}

module.exports = { authorize };
