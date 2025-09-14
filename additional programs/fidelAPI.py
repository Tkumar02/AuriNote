import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def automate_fidelity_search(search_term):
    """
    Automates a search on Fidelity's website for a given search term.
    Returns a dictionary of results or an error message.
    """
    driver = None
    try:
        chrome_options = Options()
        chrome_options.add_experimental_option("excludeSwitches", ["enable-logging"])
        chrome_options.add_argument("--headless")  # Run browser in the background

        print("Starting the browser...")
        driver = webdriver.Chrome(options=chrome_options)
        url = "https://www.fidelity.co.uk/search/?host=www.fidelity.co.uk"
        print(f"Navigating to {url}...")
        driver.get(url)

        wait = WebDriverWait(driver, 20)
        
        # Switch into iframe
        frame_selector = (By.ID, "answers-frame")
        wait.until(EC.frame_to_be_available_and_switch_to_it(frame_selector))

        # Locate and use search box
        search_box_selector = (By.ID, "yxt-SearchBar-input--SearchBar")
        search_box = wait.until(EC.presence_of_element_located(search_box_selector))
        search_box.clear()
        search_box.send_keys(search_term)
        time.sleep(1)
        search_box.send_keys(Keys.RETURN)

        # Wait for and click first result (still inside iframe)
        first_result_selector = (By.CSS_SELECTOR, "a.HitchhikerDocumentStandard-titleLink")
        first_result_link = wait.until(EC.element_to_be_clickable(first_result_selector))
        driver.execute_script("arguments[0].click();", first_result_link)

        # Switch back to main page
        driver.switch_to.default_content()

        # Extract instrument name
        name_selector = (By.CSS_SELECTOR, "h1.detail__name")
        name_elem = wait.until(EC.presence_of_element_located(name_selector))
        instrument_name = name_elem.text.strip()

        # Try to extract prices
        buy_price = None
        sell_price = None
        try:
            buy_selector = (By.CSS_SELECTOR, "div.buyPrice, span.buyPrice, h3.buyPrice")
            sell_selector = (By.CSS_SELECTOR, "div.sellPrice, span.sellPrice, h3.sellPrice")
            buy_price_elem = wait.until(EC.presence_of_element_located(buy_selector))
            sell_price_elem = wait.until(EC.presence_of_element_located(sell_selector))
            buy_price = buy_price_elem.text.strip()
            sell_price = sell_price_elem.text.strip()
        except TimeoutException:
            try:
                sell_xpath = '//div[normalize-space(text())="Sell"]/following-sibling::h3[contains(@class,"detail_value")]'
                buy_xpath = '//div[normalize-space(text())="Buy"]/following-sibling::h3[contains(@class,"detail_value")]'
                sell_elem = wait.until(EC.presence_of_element_located((By.XPATH, sell_xpath)))
                buy_elem = wait.until(EC.presence_of_element_located((By.XPATH, buy_xpath)))
                sell_price = sell_elem.text.strip()
                buy_price = buy_elem.text.strip()
            except TimeoutException:
                try:
                    fund_xpath = '//div[contains(text(),"Last buy/sell price")]/following-sibling::h3[contains(@class,"detail_value")]'
                    fund_elem = wait.until(EC.presence_of_element_located((By.XPATH, fund_xpath)))
                    buy_price = fund_elem.text.strip()
                    sell_price = buy_price
                except TimeoutException:
                    pass

        return {
            "instrument": instrument_name,
            "buy_price": buy_price,
            "sell_price": sell_price,
            "url": driver.current_url
        }

    except (NoSuchElementException, TimeoutException) as e:
        return {"error": f"Failed to locate an element: {e}"}
    except Exception as e:
        return {"error": f"An unexpected error occurred: {e}"}
    finally:
        if driver:
            print("Closing the browser.")
            driver.quit()

@app.route('/api/findInvest', methods=['POST'])
def find_investment():
    """
    API endpoint to find investment details.
    Receives a search_term from the client in the request body.
    """
    data = request.get_json()
    search_term = data.get('search_term')
    
    if not search_term:
        return jsonify({'error': 'Search term is required.'}), 400

    print(f"Received search request for: {search_term}")
    result = automate_fidelity_search(search_term)

    # Return the result as a JSON response
    if "error" in result:
        return jsonify(result), 500
    else:
        return jsonify(result)

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5001, debug=True)
