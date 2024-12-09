# Category Tree Builder

Solidne i rozszerzalne rozwiązanie do budowania uporządkowanych drzew kategorii z konfigurowalnymi regułami transformacji.

## Kluczowe Ulepszenia

- **Separacja Odpowiedzialności**: Rozdziela ogólną logikę budowania drzewa (`OrderedTreeBuilder`) od implementacji specyficznej dla kategorii (`CategoryOTreeBuilder`)
- **Bezpieczeństwo Typów**: Wykorzystuje TypeScript generics dla lepszego wnioskowania typów i sprawdzania podczas kompilacji
- **Konfigurowalność**: Umożliwia dostosowanie reguł sortowania i transformacji poprzez wstrzykiwanie zależności
- **Łatwość Utrzymania**: Redukuje duplikację kodu i poprawia czytelność poprzez przejrzystą hierarchię klas
- **Obsługa Błędów**: Implementuje właściwą obsługę błędów i przypadków brzegowych
- **Naprawione Błędy**: Koryguje problem z sortowaniem kategorii poprzez prawidłowe parsowanie prefiksów numerycznych z tytułów

## Architektura

Rozwiązanie składa się z dwóch głównych komponentów:

1. **BaseTreeBuilder**: Generyczny builder drzewa, który obsługuje podstawową logikę:
   - Transformację węzłów drzewa
   - Rekurencyjne przetwarzanie dzieci
   - Sortowanie węzłów

2. **CategoryTreeBuilder**: Specjalistyczna implementacja, która dodaje:
   - Reguły sortowania specyficzne dla kategorii
   - Flagi widoczności na stronie głównej
   - Integrację ze źródłem danych

## Użycie

Aby użyć buildera drzewa kategorii:

```typescript
// Używając statycznej metody fabrykującej
const tree = await CategoryOTreeBuilder.fromQuery(getCategories);

// Lub używając buildera bezpośrednio
const builder = new CategoryOTreeBuilder();
const tree = builder.buildTree(categories);
```

## Testowanie

Rozwiązanie można przetestować używając dostarczonych danych wejściowych:

```bash
npm run test
```

Testy weryfikują zarówno funkcjonalność sortowania, jak i reguły widoczności na stronie głównej.

## Rozszerzanie

Rozwiązanie można rozszerzyć poprzez:

1. Tworzenie nowych wyspecjalizowanych builderów dziedziczących po `OrderedTreeBuilder`
2. Dostosowywanie `OrderedTreeBuilderConfig` dla różnych reguł transformacji
3. Implementację nowych integracji ze źródłami danych poprzez metodę statyczną `fromQuery`



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
