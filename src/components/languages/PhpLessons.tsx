import React from 'react';
import { Lesson, Difficulty } from '../../types/quiz';

export const phpLessons: Record<Difficulty, Lesson[]> = {
  Beginner: [
    {
      id: 'php_basics_1',
      title: 'Introduction to PHP',
      content: `PHP is a popular server-side scripting language designed for web development.

Key Concepts:
• Basic syntax
• Variables and data types
• Operators
• Control structures`,
      codeExamples: [`
<?php
// Variables and data types
$name = "John";
$age = 25;
$height = 1.75;
$isStudent = true;

// Output
echo "Hello, $name!";
print_r($age);

// Control structures
if ($age >= 18) {
    echo "Adult";
} else {
    echo "Minor";
}

// Loops
for ($i = 0; i < 5; $i++) {
    echo $i . " ";
}
?>`],
      difficulty: 'Beginner',
      order: 1,
    },
    {
      id: 'php_basics_2',
      title: 'Arrays and Functions',
      content: `Working with arrays and functions in PHP.

Key Concepts:
• Indexed arrays
• Associative arrays
• Array functions
• User-defined functions`,
      codeExamples: [`
<?php
// Arrays
$fruits = ['apple', 'banana', 'orange'];
$user = [
    'name' => 'John',
    'age' => 25,
    'email' => 'john@example.com'
];

// Array functions
array_push($fruits, 'grape');
sort($fruits);
print_r($fruits);

// Functions
function greet($name, $greeting = 'Hello') {
    return "$greeting, $name!";
}

echo greet('John');  // Hello, John!
echo greet('Jane', 'Hi');  // Hi, Jane!
?>`],
      difficulty: 'Beginner',
      order: 2,
    },
    {
      id: 'php_basics_3',
      title: 'Working with Forms',
      content: `Handling HTML forms with PHP.

Key Concepts:
• GET and POST methods
• Form validation
• File uploads
• Security considerations`,
      codeExamples: [`
<?php
// Form handling
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    
    if ($email === false) {
        $error = "Invalid email format";
    } else {
        // Process the form
        echo "Form submitted successfully";
    }
}
?>

<form method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>">
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <button type="submit">Submit</button>
</form>`],
      difficulty: 'Beginner',
      order: 3,
    }
  ],
  Intermediate: [
    {
      id: 'php_inter_1',
      title: 'Object-Oriented PHP',
      content: `Understanding OOP concepts in PHP.

Key Concepts:
• Classes and objects
• Inheritance
• Encapsulation
• Polymorphism`,
      codeExamples: [`
<?php
class User {
    private $name;
    protected $email;
    
    public function __construct($name, $email) {
        $this->name = $name;
        $this->email = $email;
    }
    
    public function getName() {
        return $this->name;
    }
}

class Admin extends User {
    private $role;
    
    public function __construct($name, $email, $role) {
        parent::__construct($name, $email);
        $this->role = $role;
    }
}

$admin = new Admin("John", "john@example.com", "super-admin");
echo $admin->getName();
?>`],
      difficulty: 'Intermediate',
      order: 1,
    }
  ],
  Advanced: [
    {
      id: 'php_adv_1',
      title: 'Advanced PHP Concepts',
      content: `Advanced programming concepts in PHP.

Key Concepts:
• Namespaces
• Traits
• Dependency injection
• Design patterns`,
      codeExamples: [`
<?php
namespace App\Services;

trait Loggable {
    public function log($message) {
        // Log implementation
    }
}

class UserService {
    use Loggable;
    
    private $db;
    
    public function __construct(Database $db) {
        $this->db = $db;
    }
    
    public function createUser($data) {
        $this->log("Creating new user");
        // Implementation
    }
}`],
      difficulty: 'Advanced',
      order: 1,
    }
  ]
};
