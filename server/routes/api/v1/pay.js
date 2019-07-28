import { Router } from 'express';
import request from 'request';
import getRandomString from '../../../helpers/getRandomString';
import models from '../../../models';

const payRouter = Router();

payRouter.get('/pay', (req, res) => {
  const data = {
    customer_email: 'user@example.com',
    amount: 300,
    currency: 'NGN',
    txref: getRandomString(),
    PBFPubKey: process.env.RAVE_KEY,
    redirect_url: 'http://localhost:3000/api/v1/rave/response',
    payment_plan: 'pass the plan id',
  };
  request({
    uri: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/hosted/pay',
    method: 'POST',
    headers:
      {
        name: 'content-type',
        value: 'application/x-www-form-urlencoded'
      },
    body: data,
    json: true,

  }, (error, response, body) => {
    if (body.status === 'success') {
      const { link } = body.data;
      res.redirect(link);
    } else {
      // handle something went wrong in the frontend here.
      console.log('something went wrong');
    }
  });
});

payRouter.post('/rave/response', (req, res) => {
//   console.log('this is the response ', req.query);
//   res.send('this is the way i would knock Ekpang GIKJGHKJHKLJHL');
  const data = {
    SECKEY: process.env.RAVE_SECRET_KEY,
    txref: req.query.txref,
  };
  request({
    uri: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/verify',
    method: 'POST',
    headers:
      {
        name: 'content-type',
        value: 'application/x-www-form-urlencoded'
      },
    body: data,
    json: true,

  }, (error, response, body) => {
    const {
      status, currency, chargecode, amount
    } = body.data;
    if (status === 'successful' && (currency === 'NGN') && (chargecode === '00')) {
      const { Subscription } = models;
      Subscription.increment(
        { amount },
        { where: { userId: process.env.TEMPID } }
      );
      res.send('this is the way i would knock Ekpang GIKJGHKJHKLJHL');
    }
  });
});

export default payRouter;
