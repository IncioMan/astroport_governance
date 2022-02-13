import pandas as pd
from constants import cols_dict
import requests
import random

class DataProvider:
    
    def load_data(self):
        ##Users stats
        self.user_stats_df = self.claim(self.user_stats,self.cols_claim,self.data_claim)
        self.user_stats_df.columns = [c.lower() for c in self.user_stats_df.columns]
        
        self.count_durations_users = \
            self.user_stats_df.groupby('sender').duration.nunique().reset_index()\
                 .groupby('duration').sender.count().reset_index()\
                 .rename(columns={
                            'duration':'Number of lockup durations',
                            'sender':'Number of users'})
        ##Hourly new users
        self.hourly_new_users_df = self.claim(self.hourly_new_users,self.cols_claim,self.data_claim)
        self.hourly_new_users_df.columns = [c.lower() for c in self.hourly_new_users_df.columns]
        self.hourly_new_users_df=self.hourly_new_users_df.sort_values(by='time',ascending=True)
        self.hourly_new_users_df['cumsum_new_users'] = self.hourly_new_users_df.new_users.cumsum()

        ##Hourly stats
        self.hourly_stats_df = self.claim(self.hourly_stats,self.cols_claim,self.data_claim)
        self.hourly_stats_df.columns = [c.lower() for c in self.hourly_stats_df.columns]
        self.hourly_stats_df = self.hourly_stats_df.sort_values(by='hr',ascending=True)
        self.hourly_stats_df['net_deposit_3'] = (self.hourly_stats_df.dep_amount_3-self.hourly_stats_df.with_amount_3).cumsum()
        self.hourly_stats_df['net_deposit_6'] = (self.hourly_stats_df.dep_amount_6-self.hourly_stats_df.with_amount_6).cumsum()
        self.hourly_stats_df['net_deposit_9'] = (self.hourly_stats_df.dep_amount_9-self.hourly_stats_df.with_amount_9).cumsum()
        self.hourly_stats_df['net_deposit_12'] = (self.hourly_stats_df.dep_amount_12-self.hourly_stats_df.with_amount_12).cumsum()
        self.hourly_stats_df['net_deposit_15'] = (self.hourly_stats_df.dep_amount_15-self.hourly_stats_df.with_amount_15).cumsum()
        self.hourly_stats_df['net_deposit_18'] = (self.hourly_stats_df.dep_amount_18-self.hourly_stats_df.with_amount_18).cumsum()
        self.hourly_stats_df['tot_txs'] = self.hourly_stats_df.with_tx + self.hourly_stats_df.deposit_tx

        self.time_duration_df = self.hourly_stats_df[['hr','net_deposit_3','net_deposit_6','net_deposit_9','net_deposit_12','net_deposit_15','net_deposit_18']]
        self.time_duration_df = self.time_duration_df.rename(columns={
            'net_deposit_3':'3 months',
            'net_deposit_6':'6 months',
            'net_deposit_9':'9 months',
            'net_deposit_12':'12 months',
            'net_deposit_15':'15 months',
            'net_deposit_18':'18 months'
        })
        self.time_duration_df = self.time_duration_df.melt(id_vars=["hr"], 
                var_name="Lockup period", 
                value_name="UST deposited")

        self.last_duration_amount = self.hourly_stats_df[self.hourly_stats_df.hr==self.hourly_stats_df.hr.max()]
        self.last_duration_amount= self.last_duration_amount[['net_deposit_3','net_deposit_6','net_deposit_9',
                            'net_deposit_12','net_deposit_15','net_deposit_18']]
        self.last_duration_amount = self.last_duration_amount.rename(columns={
                    'net_deposit_3':'3 months',
                    'net_deposit_6':'6 months',
                    'net_deposit_9':'9 months',
                    'net_deposit_12':'12 months',
                    'net_deposit_15':'15 months',
                    'net_deposit_18':'18 months'
                })
        self.last_duration_amount = self.last_duration_amount.T.reset_index()
        self.last_duration_amount.columns = ['Lockup period','UST deposited']

        #Wallet age
        self.wallet_age_df = self.claim(self.wallet_age,self.cols_claim,self.data_claim)
        self.wallet_age_df.columns = [c.lower() for c in self.wallet_age_df.columns]
        self.dates_to_mark = pd.DataFrame([
            ['2021-03-04', '2021-03-11',80,'Anchor launch'],
            ['2021-09-24', '2021-10-01',80,'Columbus 5'],
            ['2021-12-12', '2021-12-19',80,'Astroport launch'], 
            ['2022-01-24', '2022-02-01',80,'Prism launch']], 
            columns=['text_date','date','height','text']
        )

    def __init__(self, claim, get_url=None):
        self.claim = claim
        self.get_url = get_url


        self.user_stats = '1'
        self.hourly_new_users = '2'
        self.wallet_age = '3'
        self.hourly_stats = '4'
        self.users_balance = '5'
        ###
        self.cols_claim = {
            self.user_stats : ['SENDER', 'DURATION', 'AMOUNT'],
            self.hourly_stats : ['HR', 
                                'DEP_AMOUNT', 'DEPOSIT_TX', 'DEP_USERS',
                                'WITH_AMOUNT', 'WITH_TX', 'WITH_USERS',
                                'DEP_AMOUNT_3', 'DEP_AMOUNT_6', 'DEP_AMOUNT_9','DEP_AMOUNT_12', 'DEP_AMOUNT_15', 'DEP_AMOUNT_18',
                                'WITH_AMOUNT_3', 'WITH_AMOUNT_6', 'WITH_AMOUNT_9','WITH_AMOUNT_12', 'WITH_AMOUNT_15', 'WITH_AMOUNT_18',
            ],
            self.wallet_age : ['MIN_DATE','ADDRESS_COUNT'],
            self.hourly_new_users: ['TIME','NEW_USERS'],
            self.users_balance: ['SENDER','BALANCE  '],
        }

        self.data_claim = {
            self.user_stats : [['user1_1',3,10],
                    ['user1_2',3,3],
                    ['user1_3',3,4],
                    ['user1_4',3,67],
                    ['user1_5',3,33],
                    ['user1',9,20],
                    ['user1',18,15],
                    ['user2',3,10],
                    ['user2',6,120],
                    ['user2',18,13],
                    ['user2',3,10],
                    ['user3',6,120],
                    ['user3',18,13]],
            self.hourly_stats : [['2021-09-21T07:00:00Z',1000,4,3,
                        100,1,1,
                        10,20,30,40,50,60,
                        0,0,10,0,0,0],
                    ['2021-09-21T08:00:00Z',1000,4,3,
                        200,1,1,
                        10,10,30,10,50,5,
                        0,0,0,0,7,0],
                    ['2021-09-21T09:00:00Z',1000,4,3,
                        200,1,1,
                        10,10,30,10,50,5,
                        0,0,0,0,7,0]],
            self.wallet_age : [
                ['2021-09-21T09:00:00Z',30],
                ['2021-11-21T09:00:00Z',40],
                ['2021-15-21T09:00:00Z',20],
                ['2021-13-21T09:00:00Z',40],
                ['2021-10-21T09:00:00Z',120]
            ],
            self.hourly_new_users: [['2021-09-21T07:00:00Z',1000],
                                    ['2021-09-21T08:00:00Z',600],
                                    ['2021-09-21T09:00:00Z',200]],
            self.users_balance: ['SENDER','BALANCE  '],
    }