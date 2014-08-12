Calculator
==========

Simple web-based calculator

Test by cloning the repository and (on a Mac at least) running the following command:

    python -m SimpleHTTPServer 8000

Features
--------

- A simple accumulating calculator
- Supports addition, subtraction, multiplication, division and square root
- Displays current value and prior value
- Displays current operation
- Groups 000's digits
- Supports dark and light themes via the 'theme' attribute on the component
- Indicates error when dividing by zero, taking the square root of a negative number or entering too many digits
- Lightly tested on Chrome 36.0.1985.125, Firefox 31.0 and Safari 7.0.5 - no apparent issues

Known issues
------------

- I'm not a graphic designer
- This is my first use of Polymer so the approach I've taken may not be idiomatic
- In a production component I'd separate the calculator model into it's own 'class' for abstraction, maintainability and testing
- Using toPrecision() to control # of decimal places is a hack, we could make this smarter and not lose precision for large numbers
- The component assumes a US Locale and formats numbers for a US audience
- Need access to a Windows machine to test on Internet Explorer

Testing strategy
----------------

If this were a production component then it should come with and be a part of an automated testing process.
I'd separate the abstract calculator functionality out of the Polymer wrapper and expose a specific interface
with keypress inputs, and accumulator, error and current operation outputs. I'd then write a test function
that takes a list of keypresses and an expected state for each of the outputs. I'd then write a sequence of tests
using that function to cover all the basic operations, edge cases and expected errors.

In the past I've used mocha to automate nearly 4,000 tests against a large node.js code base including REST APIs,
core code and database interactions.
