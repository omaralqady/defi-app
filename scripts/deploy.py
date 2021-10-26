from scripts.utils import get_account, get_contract
from brownie import FPSToken, TokenFarm, network, config
from web3 import Web3


KEPT_BALANCE = Web3.toWei(10, "ether")


def deploy_token():
    account = get_account()
    token = FPSToken.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("Verify", False),
    )
    print("Deployed FPS token!")
    return token


def deploy_token_farm(token_address):
    account = get_account()
    token_farm = TokenFarm.deploy(
        token_address,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("Verify", False),
    )
    print("Deployed token farm!")
    return token_farm


def send_tokens_to_farm(token, farm, token_list):
    account = get_account()
    tx = token.transfer(
        farm.address, token.totalSupply() - KEPT_BALANCE, {"from": account}
    )
    tx.wait(1)
    price_feed_tx = farm.setPriceFeedContract(
        token.address, token_list["fps_token"], {"from": account}
    )
    price_feed_tx.wait(1)


def add_allowed_tokens(token_farm, token_list, account):
    for token in token_list:
        print(f"Token being added: {token}")
        tx = token_farm.addAllowedToken(token_list[token], {"from": account})
        tx.wait(1)


def deploy_token_and_token_farm():
    token = deploy_token()
    farm = deploy_token_farm(token.address)
    return farm, token


def main():
    # leaving this at the top of the file was causing a weird testing error
    # where network.show_active() returned None - to be investigated later
    token_list = {
        "weth_token": get_contract("eth_usd_price_feed"),
        # fau is used as a replacement for dai
        "fau_token": get_contract("dai_usd_price_feed"),
        # make fps equivalent to dai as well
        "fps_token": get_contract("dai_usd_price_feed"),
    }

    farm, token = deploy_token_and_token_farm()
    send_tokens_to_farm(token, farm.token_list)
    add_allowed_tokens(farm, token_list, get_account())
