import time
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def get_user_input(prompt):
    try:
        return input(prompt)
    except (KeyboardInterrupt, EOFError):
        print("\nOperation cancelled by user.")
        sys.exit(0)


def automate_fidelity_search(search_term):
    driver = None
    try:
        chrome_options = Options()
        chrome_options.add_experimental_option("excludeSwitches", ["enable-logging"])
        # chrome_options.add_argument("--headless")

        print("Starting the browser...")
        driver = webdriver.Chrome(options=chrome_options)

        url = "https://www.fidelity.co.uk/search/?host=www.fidelity.co.uk"
        print(f"Navigating to {url}...")
        driver.get(url)

        wait = WebDriverWait(driver, 20)

        # --- Step 0: Switch into iframe that contains the search box ---
        print("Switching into search iframe...")
        frame_selector = (By.ID, "answers-frame")
        wait.until(EC.frame_to_be_available_and_switch_to_it(frame_selector))

        # --- Step 1: Locate and use search box ---
        print("Locating search box...")
        search_box_selector = (By.ID, "yxt-SearchBar-input--SearchBar")
        search_box = wait.until(EC.presence_of_element_located(search_box_selector))

        print(f"Entering search term: {search_term}")
        search_box.clear()
        search_box.send_keys(search_term)
        time.sleep(1)
        search_box.send_keys(Keys.RETURN)

        # --- Step 2: Wait for and click first result (still inside iframe) ---
        print("Waiting for first search result...")
        first_result_selector = (By.CSS_SELECTOR, "a.HitchhikerDocumentStandard-titleLink")
        first_result_link = wait.until(EC.element_to_be_clickable(first_result_selector))
        print("Clicking first result...")
        driver.execute_script("arguments[0].click();", first_result_link)

        # --- Step 3: Switch back to main page (factsheet loads here) ---
        driver.switch_to.default_content()
        print("Switched back to main document.")

        # --- Step 4: Extract instrument name ---
        print("Waiting for instrument name...")
        name_selector = (By.CSS_SELECTOR, "h1.detail__name")
        name_elem = wait.until(EC.presence_of_element_located(name_selector))
        instrument_name = name_elem.text.strip()

        # --- Step 5: Try extracting prices ---
        print("Waiting for price elements...")

        buy_price = None
        sell_price = None

        try:
            # Case 1: Stocks with dedicated classes
            buy_selector = (By.CSS_SELECTOR, "div.buyPrice, span.buyPrice, h3.buyPrice")
            sell_selector = (By.CSS_SELECTOR, "div.sellPrice, span.sellPrice, h3.sellPrice")

            buy_price_elem = wait.until(EC.presence_of_element_located(buy_selector))
            sell_price_elem = wait.until(EC.presence_of_element_located(sell_selector))

            buy_price = buy_price_elem.text.strip()
            sell_price = sell_price_elem.text.strip()
            print("Detected stock-style pricing.")
        except TimeoutException:
            print("Stock-style pricing not found, trying ETF/Fund-style...")

            try:
                # Case 2: ETF — has Sell / Buy labels + h3.detail_value
                sell_xpath = '//div[normalize-space(text())="Sell"]/following-sibling::h3[contains(@class,"detail_value")]'
                buy_xpath = '//div[normalize-space(text())="Buy"]/following-sibling::h3[contains(@class,"detail_value")]'

                sell_elem = wait.until(EC.presence_of_element_located((By.XPATH, sell_xpath)))
                buy_elem = wait.until(EC.presence_of_element_located((By.XPATH, buy_xpath)))

                sell_price = sell_elem.text.strip()
                buy_price = buy_elem.text.strip()
                print("Detected ETF-style pricing.")
            except TimeoutException:
                print("ETF-style pricing not found, trying Fund-style...")

                try:
                    # Case 3: Fund — "Last buy/sell price" label + h3.detail_value
                    fund_xpath = '//div[contains(text(),"Last buy/sell price")]/following-sibling::h3[contains(@class,"detail_value")]'
                    fund_elem = wait.until(EC.presence_of_element_located((By.XPATH, fund_xpath)))
                    buy_price = fund_elem.text.strip()
                    sell_price = buy_price  # Same value for funds
                    print("Detected Fund-style pricing.")
                except TimeoutException:
                    print("Could not find any price element.")

        print("\n--- Extracted Result ---")
        print(f"Instrument: {instrument_name}")
        if buy_price and sell_price:
            print(f"Buy Price: {buy_price}")
            print(f"Sell Price: {sell_price}")
            print(driver.current_url)
        else:
            print("No prices found.")

    except (NoSuchElementException, TimeoutException) as e:
        print(f"Failed to locate an element. Error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        if driver:
            print("Closing the browser.")
            driver.quit()


if __name__ == "__main__":
    search_term = get_user_input("Please enter the name of the fund, ETF, or share to search for: ")
    if search_term:
        automate_fidelity_search(search_term)
