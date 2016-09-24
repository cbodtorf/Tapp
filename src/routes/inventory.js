/***********************
* INVENTORY
***********************/
'use strict'

const Boom = require ('boom')
const Uuid = require ('node-uuid')
const Joi = require('joi')

exports.register = (server, options, next) => {
  const db = server.app.db

  /***********************
  *  ROUTES
  ***********************/
  server.route({
    // find ALL inventory
    method: 'GET',
    path: '/inventory',

    handler(request, reply) {
      db.inventory.find((err, data) => {
          if (err) {
              return reply(Boom.wrap(err, 'Internal MongoDB error'))
          }
          reply(data)
      })
    }
  })

  server.route({
    // find ONE beer
    method: 'GET',
    path: '/inventory/{id}',

    handler(request, reply) {
      db.inventory.findOne(
        {_id: request.params.id},
        (err, data) => {

        if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
        if (!data) { return reply(Boom.notFound()) }

        reply(data)
      })

    }
  })

  server.route({
    // save ONE beer
    method: 'POST',
    path: '/inventory',

    handler(requet, reply) {
      const beer = request.payload
      //create an id
      beer._id = Uuid.v1()

      db.inventory.save(account, (err, result) => {

        if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }

        reply(account)
      })

    },
    config: {
      validate: {
        payload: {

          name: Joi.string().min(10).max(50).required(),
          brewery: Joi.string().min(10).max(50).required(),
          beerType: Joi.string().min(1).max(50).required(),
          description: Joi.string().min(1).max(150).required(),
          qtyCases: Joi.number().required(),
          qtySixtels: Joi.number().required(),
          qtyHalfBarrels: Joi.number().required(),
          unitPrice: Joi.number().required(),
          distributer: Joi.string().min(10).max(50).required()

        }
      }
    }
  })

  server.route({
    // update ONE beer
    method: 'PATCH',
    path: '/inventory/{id}',

    handler(requet, reply) {

      db.inventory.update(
        {_id: request.params.id},
        {$set: request.payload},
        (err, result) => {

          if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
          if (result.n === 0) { return reply(Boom.notFound()) }

          reply().code(204);
      })

    },
    config: {
      validate: {
        payload: Joi.object({

          name: Joi.string().min(10).max(50).optional(),
          brewery: Joi.string().min(10).max(50).optional(),
          beerType: Joi.string().min(1).max(50).optional(),
          description: Joi.string().min(1).max(150).optional(),
          qtyCases: Joi.number().optional(),
          qtySixtels: Joi.number().optional(),
          qtyHalfBarrels: Joi.number().optional(),
          unitPrice: Joi.number().optional(),
          distributer: Joi.string().min(10).max(50).optional()

        }).required().min(1)
      }
    }
  })

  server.route({
      // remove ONE beer
      method: 'DELETE',
      path: '/inventory/{id}',
      handler(request, reply) {

          db.inventory.remove(
            {id: request.params.id},
            (err, result) => {

              if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
              if (result.n === 0) { return reply(Boom.notFound()) }

              reply().code(204);
          })
      }
  })


  return next()
}





/***********************
* this defines a new Hapi plugin called 'routes-inventory'
***********************/
exports.register.attributes = {
  name: 'routes-inventory'
}
