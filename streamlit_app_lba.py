import streamlit as st
import pandas as pd
import altair as alt
from charts import ChartProvider
import requests
from PIL import Image
from data import DataProvider
import base64

st.set_page_config(page_title="Mars Lockdrop - Analytics",\
        page_icon=Image.open(requests.get('https://raw.githubusercontent.com/IncioMan/mars_lockdrop/master/images/mars_logo_hd.png',stream=True).raw),\
        layout='wide')

###

@st.cache(ttl=10000, show_spinner=False, allow_output_mutation=True)
def claim(claim_hash, cols_claim, data_claim):
    try:
        df_claim = pd.read_json(
            f"https://api.flipsidecrypto.com/api/v2/queries/{claim_hash}/data/latest",
            convert_dates=["BLOCK_TIMESTAMP"],
        )
    except:
        return pd.DataFrame(data_claim[claim_hash],columns=cols_claim[claim_hash])
    if(len(df_claim.columns)==0):
        return pd.DataFrame(data_claim[claim_hash],columns=cols_claim[claim_hash])
    return df_claim

@st.cache(ttl=10000, show_spinner=False, allow_output_mutation=True, persist=True)
def get_url(url, index_col):
    return pd.read_csv(url, index_col=index_col)
    

data_provider = DataProvider(claim, get_url)
data_provider.load_data()
data_provider.load_data_lba()
chart_provider = ChartProvider()

###
###
st.markdown(f"""
<div class="date-banner" style=\"font-size: 13px; width: 165px; position: absolute; top: 10px;\">Last update: {data_provider.last_udpate}</div>
<div class="banner" style=\"max-width: 50px;float: left;z-index: 1\">
    <a href="https://marsprotocol.io/">
        <img src="https://raw.githubusercontent.com/IncioMan/mars_lockdrop/master/images/mars_logo_hd.png" style=\"margin-left: 5px;\" width=\"100px\">
        <img src="https://raw.githubusercontent.com/IncioMan/mars_lockdrop/master/images/M.png" width=\"100px\">
        <img src="https://raw.githubusercontent.com/IncioMan/mars_lockdrop/master/images/A.png" width=\"100px\">
        <img src="https://raw.githubusercontent.com/IncioMan/mars_lockdrop/master/images/R.png" style=\"margin-left: 6px;\" width=\"100px\">
        <img src="https://raw.githubusercontent.com/IncioMan/mars_lockdrop/master/images/S.png" width=\"100px\">
    </a>
    <div style=\"width: 100px;margin-top: 5px;margin-bottom: 10px;\"><span class="blink_me"></span>Active</div>
    <div style=\"border-top: 3px solid #ffffff;width: 100px;margin-top: 15px;padding-bottom: 20px;\"></div>
    <div style=\"width: 100px; margin-left: 10px;\">
        <a href="https://flipsidecrypto.xyz"><img src="https://raw.githubusercontent.com/IncioMan/mars_lockdrop/master//images/fc.png" width=\"30px\"></a>
        <a href="https://twitter.com/IncioMan"><img src="https://raw.githubusercontent.com/IncioMan/mars_lockdrop/master//images/twitter.png" width=\"50px\"></a>
    </div>
</div>
""", unsafe_allow_html=True)

col1, col2,col3 = st.columns([2,8,1])
with col2:
    st.subheader('Return on Investment')
    st.markdown("""50M $MARS tokens will be distributed among depositors. The longer you lock your deposit, [the higher the boost you obtain](https://mars-protocol.medium.com/mars-distribution-plan-the-mars-token-launch-lockdrop-and-more-9f6d2dc0995c).""")
    st.markdown("""Therefore, we can simulate the expected ROI (only rewards from the lockdrop) on each UST locked in each bucket. You simply have to:
                    <ul> 
                        <li> Insert what you expect the MARS token price to be </li>
                        <li> Insert your deposit and lockup period (optional) </li>
                    </ul>
                """,unsafe_allow_html=True)
    #st.markdown("""Expected ROI on single deposited UST if you deposited [] UST for [] and MARS tokens price was []""")
    

col1, col2, col4,col5 = st.columns([2,3,5,1])
with col2:
    amount_ust_input = st.number_input('UST deposit', step=1, min_value=0, help='Simulate a deposit of UST to see how this changes the ROI on the different lockup periods')
    amount_mars_input = st.number_input('MARS deposit', step=1, min_value=0, help='Simulate a deposit of UST to see how this changes the ROI on the different lockup periods')
    input_mars_price = st.number_input('$MARS price', value=1.0, step=0.01, min_value=0.01, help='By inserting the expected price of the $MARS tokens we can simulate the ROI on each UST deposited in each lockup period')
    ust_rwrd, mars_rwrd, roi_phase_2 = data_provider.get_lba_rewards(amount_ust_input,amount_mars_input,input_mars_price)
    st.text(f'Rewards from UST deposit: {round(ust_rwrd,0)} MARS')
    st.text(f'Rewards from MARS deposit: {round(mars_rwrd,0)} MARS')
with col4:
    st.altair_chart(chart_provider.roi_phase_2_chart(roi_phase_2), use_container_width=True)

col1, col2,col3 = st.columns([2,8,1])
with col2:
    st.subheader('Amount of UST locked')
    st.markdown("""Distribution of UST locked for different durations.""")
    st.markdown("""Have users preferred shorter or longer durations? Has one duration the largest share?""")
    st.altair_chart(chart_provider.lba_deposits_hourly_df_chart(data_provider.lba_deposits_hourly_df), use_container_width=True)


col1, col2,col_,col3,col4,col5 = st.columns([2,4,0.7,1.5,1.5,1.8])
with col2:
    st.subheader('Amount of UST locked')
    st.markdown("""Distribution of UST locked for different durations.""")
    st.markdown("""Have users preferred shorter or longer durations? Has one duration the largest share?""")
    st.altair_chart(chart_provider.mars_source_chart(data_provider.mars_source), use_container_width=True)
with col3:
    st.metric(label="Total UST locked",\
            value=f"${round((data_provider.tot_ust/1000000),2)}M")
    st.metric(label="Number of users", value=f"{data_provider.n_users}")
    st.metric(label="Number of transactions", value=f"{int(data_provider.n_txs)}")
with col4:
    st.metric(label="Total UST locked",\
            value=f"${round((data_provider.tot_ust/1000000),2)}M")
    st.metric(label="Number of users", value=f"{data_provider.n_users}")
    st.metric(label="Number of transactions", value=f"{int(data_provider.n_txs)}")

col1, col2, col3, col4 = st.columns([2,4,4,1])
with col2:
    st.subheader('Number of transactions over time')
    st.markdown("""The number of hourly transactions""")
    st.altair_chart(chart_provider.user_dep_type_chart(data_provider.user_dep_type), use_container_width=True)
with col3:
    st.subheader('Number of unique users over time')
    st.markdown("""The cumulative number of unique users locking UST""")
    st.altair_chart(chart_provider.user_p1_perc_mars_chart(data_provider.user_p1_perc_mars), use_container_width=True)
   
col1, col2, col3 = st.columns([2,8,1])
with col2:
    st.subheader('Top depositors')
    st.markdown("""Let's now see the top 5 addresses which have deposited the most UST. If you are curious, you can 
    look these addresses up on [ET Finder](https://finder.extraterrestrial.money/).""")
    st.table(data_provider.top_depositors)


###
#st.markdown("""This dashboard was built with love for the 🌖 community by [IncioMan](https://twitter.com/IncioMan) and [sem1d5](https://twitter.com/sem1d5)""")
st.markdown("""
<style>
    @media (min-width:640px) {
        .block-container {
            padding-left: 7rem;
            padding-right: 7rem;
        }
    }
    @media (min-width:800px) {
        .block-container {
            padding-left: 7rem;
            padding-right: 7rem;
        }
    }
    .block-container
    {
        padding-bottom: 1rem;
        padding-top: 4rem;
    }
    .st-bx{
        background-color: transparent;
    }
    .st-bu{
        background-color: transparent;
    }
    .st-bv{
        background-color: transparent;
    }
    .css-k7dvn8{
        background-color: transparent;
    }
</style>
""", unsafe_allow_html=True)
hide_streamlit_style = """
                        <style>
                        #MainMenu {visibility: hidden;}
                        #footer {visibility: hidden;}
                        </style>
                        """
st.markdown(hide_streamlit_style, unsafe_allow_html=True)
st.markdown("""
    <style>
    .terminated {
        margin-right: 10px;
        width: 10px;
        height: 10px;
        display: inline-block;
        border: 1px solid red;
        background-color: red;
        border-radius: 100%;
        opacity: 0.8;
    }

    .idle {
        margin-right: 10px;
        width: 10px;
        height: 10px;
        display: inline-block;
        border: 1px solid grey;
        background-color: grey;
        border-radius: 100%;
        opacity: 0.8;
    }

    .blink_me {
        margin-left: 15px;
        margin-right: 15px;
        animation: blinker 2s linear infinite;
        width: 10px;
        height: 10px;
        display: inline-block;
        border: 1px solid #FFFFFF;
        background-color: #FFFFFF;
        border-radius: 100%;
        }
        @keyframes blinker {
        50% {
            opacity: 0;
        }
    }

    .date-banner{
        right: 15px;
    }

    @media (min-width:800px) {
        .css-la5jjn {
            margin-top: 80px;
        }
        [data-testid="metric-container"]{
            padding-bottom: 20px;
        }
        .banner {
            position: fixed;
            padding-top: 10px;
        }
        .date-banner{
            right: 115px;
        }
    }
    </style>
    """, unsafe_allow_html=True)