import { Router } from 'express';
import request from 'request';
import getRandomString from '../../../helpers/getRandomString';
import models from '../../../models';

const payRouter = Router();

payRouter.get('/pay', (req, res) => {
  const {email, amount } = req.query;

  //Data to send to the rave api
  const data = {
    customer_email:email,
    amount: amount,
    currency: 'NGN',
    txref: getRandomString(),
    PBFPubKey: process.env.RAVE_KEY,
    redirect_url: process.env.RAVE_REDIRECT_URL,
    payment_plan: 'pass the plan id',
  };
  // making the api call
  request({
    uri: process.env.RAVE_REQUEST_URI,
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
      // handle something went wrong here.
      const hompage = process.env.USER_HOME;
      const { link } = `${hompage}?pay=fail`;
      res.redirect(link);
    }
  });
});

payRouter.post('/rave/response', (req, res) => {
  const hompage = process.env.USER_HOME;
  // get the data that is returned
  const data = {
    SECKEY: process.env.RAVE_SECRET_KEY,
    txref: req.query.txref,
  };
  request({
    uri: process.env.RAVE_VERIFY_URI,
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
      status, currency, chargecode, amount, custemail
    } = body.data;
    // Check if transaction was successful
    if (status === 'successful' && (currency === 'NGN') && (chargecode === '00')) {
      const { Subscription, User } = models;
      User.findOne({
        where: {
          email: custemail
        }
      }).then(data => {
        if(!data){
          return res.redirect(`${hompage}?pay=fail`);
        }
        //Increment user subcription amount
        Subscription.increment(
          { amount },
          { where: { userId: data.id } }
        );
        return res.redirect(`${hompage}?pay=success`);
      })
    }
    else{
      return res.redirect(`${hompage}?pay=fail`);
    }
  });
});

export default payRouter;
