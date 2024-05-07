import unittest
from lambda_function import handler_name

class TestLambda(unittest.TestCase):
    def test_lambda(self):
        self.assertEqual([], handler_name({'body': {'abc': 'def'}}, {}))

if __name__ == '__main__':
    unittest.main()