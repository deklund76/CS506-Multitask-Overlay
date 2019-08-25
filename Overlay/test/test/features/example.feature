Feature: Overlay example

  Scenario Outline: Overlay example
    Given I log a passed message "<message>"
    Then I log a passed table
      | number   | boolean   | string |
      | <number> | <boolean> | <string> |
      And I don't pass anything at all
    Then I verify this sum
      | op1 | op2 | sum   |
      | 2   | 2   | <sum> |

    Examples:
      | example | message       | number | boolean | string | sum |
      | 1       | hello, world! | 7      | false   | abcd   | 4   |
