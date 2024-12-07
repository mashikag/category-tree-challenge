# Ordered Tree Builder

A TypeScript library for building and transforming hierarchical tree structures with ordering capabilities.

## Overview

The library provides two main components:

1. `OrderedTreeBuilder`: A base class for building ordered tree structures with customizable transformation logic.
2. `CategoryOTreeBuilder`: A specialized implementation for category trees with home page visibility features.

## Usage Examples

### Basic Tree Building

```typescript
// Define your node types
type MyNode = TreeNode<{ name: string }>;
type MyOrderedNode = OrderedTreeNode<{ name: string }>;

// Create a basic builder
const builder = new OrderedTreeBuilder<MyNode, MyOrderedNode>();

// Build a tree
const result = builder.buildTree([
  { 
    id: 1, 
    name: 'Root',
    children: [
      { id: 2, name: 'Child' }
    ]
  }
]);
```

### Category Tree with Custom Ordering

```typescript
const categoryBuilder = new CategoryOTreeBuilder();

// Build a category tree with title-based ordering
const categories = [
  { id: 1, name: 'First', Title: '1#', MetaTagDescription: 'img1' },
  { id: 2, name: 'Second', Title: '2', MetaTagDescription: 'img2' }
];

const orderedTree = categoryBuilder.buildTree(categories);
// Result: Categories ordered by Title number
// '#' in Title marks categories for home page display
```
## Features

- Generic type support for flexible node structures
- Customizable ordering logic
- Preserves additional node properties during transformation
- Built-in support for category-specific features (home page visibility, image handling)

## Running Tests

```bash
npm run test
```

Note: It is expected to see two error logs in the console when running the tests. It is part of the test suite.


_____ 

> ## A co my tu mamy?
> 
> W pliku **task.ts** mamy funkcje która pobiera drzewo kategorii pewnych > produktów z zewnętrznego źródła, odpowiednio je mapuje i zwraca.
> Dodatkowo funkcja **categoryTree** zawiera błąd, polegający na niewłaściwym > sortowaniu kategorii drugiego poziomu (szczegóły w wymaganiach do zadania).
> 
> W pliku **mockedApi.ts** znajduje się fejkowe źródło danych i tam nie ma > potrzeby nic zmieniać.
> 
> ## A co my tu mamy?
> 
> W pliku **task.ts** mamy funkcje która pobiera drzewo kategorii pewnych > produktów z zewnętrznego źródła, odpowiednio je mapuje i zwraca.
> Dodatkowo funkcja **categoryTree** zawiera błąd, polegający na niewłaściwym > sortowaniu kategorii drugiego poziomu (szczegóły w wymaganiach do zadania).
> 
> W pliku **mockedApi.ts** znajduje się fejkowe źródło danych i tam nie ma > potrzeby nic zmieniać.
> 
> ## Co należy zrobić?
>
> - [x] Refactor funkcji categoryTree. Wszystkie chwyty dozwolone. Dzielenie funkcji, wynoszenie zależności, zmiana parametrów wejściowych, etc...
> - [x] Źródło danych (funkcja getCategories) powinna być przekazywana jako zależność. W idealnym scenariuszu categoryTree opiera się na abstrakcji i nie jest świadoma co konretnie zostanie jej przekazane
> - [x] Poprawiony zostanie bug opisany poniżej.
> - [x] W osobnym pliku przeprowadzony zostanie dowód (w postaci kodu) который jednoznacznie pokaże poprawność działania funkcji categoryTree.
> 
> Wszystkie potrzebne paczki são já w tym repozytorium, aczkolwiek można użytkować dowolnych.
> 
> ## Na czym polega bug?
> 
> Dla każdej pobieranej kategorii, w parametrze **Title** moze być zawarta opcjonalna numeracja która powinna definiować kolejność zwracaną przez funkcje (w polu **order**).
> Na ten moment sortowanie działa nieprawidłowo, należy to poprawić.
> 
> Dla wejścia znajdującego się w pliku **input.ts**, w tym momencie funkcja zwraca takie wyjście jak w pliku **currentResult.ts**. Oczekiwane wyjście zawarte jest w pliku **correctResult.ts**
> 
> ## Jak użytkować tego repo
> 
> Najważniejsza komenda dla tego zadania to **npm run test** - buduje ona TSa i odpala testy. Ta komenda się wywali jeśli kod nie przejdzie eslinta i prettiera. Zatem żeby sprawdzić swoje zadanie należy najpierw pozbyć się błędów z eslinta i odpalić **fix:prettier**.
>