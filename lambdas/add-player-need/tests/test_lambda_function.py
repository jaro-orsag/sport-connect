import unittest
from lambda_function import lambda_handler

class TestLambda(unittest.TestCase):
    def test_lambda(self):
        self.assertEqual([], lambda_handler({'body': {'abc': 'def'}}, {}))

if __name__ == '__main__':
    unittest.main()