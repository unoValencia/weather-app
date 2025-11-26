import { Component, output, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-weather-search',
  templateUrl: './weather-search.html',
  styleUrl: './weather-search.css'
})

export class WeatherSearch {
  private platformId = inject(PLATFORM_ID);
  private readonly HISTORY_KEY = 'weatherSearchHistory';
  private readonly MAX_HISTORY = 5;
  
  public readonly searchQuery = signal<string>('');
  public readonly searchTriggered = output<{ city: string; units: 'metric' | 'imperial' }>();
  public readonly searchHistory = signal<string[]>([]);
  public readonly showHistory = signal<boolean>(false);

  constructor() {
    if (this.isBrowser()) {
      this.loadHistory();
    }
  }

  public isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadHistory(): void {
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY);
      if (stored) {
        this.searchHistory.set(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }

  private saveToHistory(city: string): void {
    if (!this.isBrowser()) return;

    const history = this.searchHistory();
    const normalizedCity = city.trim();
    
    // Remove if already exists
    const filtered = history.filter(item => item.toLowerCase() !== normalizedCity.toLowerCase());
    
    // Add to beginning
    const newHistory = [normalizedCity, ...filtered].slice(0, this.MAX_HISTORY);
    
    this.searchHistory.set(newHistory);
    
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  public clearHistory(): void {
    this.searchHistory.set([]);
    if (this.isBrowser()) {
      try {
        localStorage.removeItem(this.HISTORY_KEY);
      } catch (error) {
        console.error('Failed to clear search history:', error);
      }
    }
  }

  public selectFromHistory(city: string): void {
    this.searchQuery.set(city);
    this.showHistory.set(false);
    this.onSearch();
  }

  public onFocus(): void {
    if (this.searchHistory().length > 0) {
      this.showHistory.set(true);
    }
  }

  public onBlur(): void {
    // Delay to allow click on history item
    setTimeout(() => this.showHistory.set(false), 200);
  }

  public onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  public onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.saveToHistory(query);
      this.showHistory.set(false);
      this.searchTriggered.emit({ 
        city: query, 
        units: 'metric'
      });
    }
  }
}