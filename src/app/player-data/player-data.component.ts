import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PlayerDataService } from '../services/player-data.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-player-data',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule, MaterialModule, BaseChartDirective],
  templateUrl: './player-data.component.html',
  styleUrls: ['./player-data.component.css']
})
export class PlayerDataComponent implements OnInit {
  // Dropdown options
  statistics = ['Fantasy Points', 'Passing Yards', 'Passing Air Yards', 'Passing TDs', 'INTs Thrown', 'Targets', 'Receptions', 'Receiving Yards', 'Receiving Air Yards', 
                'Yards After Catch', 'Receiving TDs', 'Rushing Yards', 'Rushing TDs', 'Target Share', 'INT %', 'Yards Per Attempt', 'Yards Per Reception', 'Completion %'];
  years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  weeks = Array.from({ length: 17 }, (_, i) => i + 1);
  positions = ['QB', 'RB', 'WR', 'TE'];

  // Map statistic names to attribute names
  statistic_map = new Map<string, string>([
    ['Fantasy Points', 'fantasy_points_ppr'],
    ['Passing Yards', 'passing_yards'],
    ['Passing Air Yards', 'passing_air_yards'],
    ['Passing TDs', 'pass_td'],
    ['INTs Thrown', 'interception'],
    ['Targets', 'targets'],
    ['Receptions', 'receptions'],
    ['Receiving Yards', 'receiving_yards'],
    ['Receiving Air Yards', 'receiving_air_yards'],
    ['Yards After Catch', 'yards_after_catch'],
    ['Receiving TDs', 'reception_td'],
    ['Rushing Yards', 'rushing_yards'],
    ['Rushing TDs', 'run_td'],
    ['Target Share', 'target_share'],
    ['INT %', 'int_pct'],
    ['Yards Per Attempt', 'ypa'],
    ['Yards Per Reception', 'ypr'],
    ['Completion %', 'comp_pct']
  ]);

  // Store for dynamic bar chart coloring
  nflTeamColors = new Map<string, { backgroundColor: string, borderColor: string }>([
    ['ARI', { backgroundColor: 'rgba(186, 12, 47, 0.2)', borderColor: 'rgba(186, 12, 47, 1)' }], // Arizona Cardinals - Red
    ['ATL', { backgroundColor: 'rgba(226, 38, 56, 0.2)', borderColor: 'rgba(226, 38, 56, 1)' }], // Atlanta Falcons - Red
    ['BAL', { backgroundColor: 'rgba(0, 0, 0, 0.2)', borderColor: 'rgba(0, 0, 0, 1)' }], // Baltimore Ravens - Black
    ['BUF', { backgroundColor: 'rgba(0, 51, 102, 0.2)', borderColor: 'rgba(0, 51, 102, 1)' }], // Buffalo Bills - Blue
    ['CAR', { backgroundColor: 'rgba(0, 51, 102, 0.2)', borderColor: 'rgba(0, 51, 102, 1)' }], // Carolina Panthers - Blue
    ['CHI', { backgroundColor: 'rgba(0, 51, 102, 0.2)', borderColor: 'rgba(0, 51, 102, 1)' }], // Chicago Bears - Navy Blue
    ['CIN', { backgroundColor: 'rgba(255, 68, 0, 0.2)', borderColor: 'rgba(255, 68, 0, 1)' }], // Cincinnati Bengals - Orange
    ['CLE', { backgroundColor: 'rgba(160, 82, 45, 0.2)', borderColor: 'rgba(160, 82, 45, 1)' }], // Cleveland Browns - Brown
    ['DAL', { backgroundColor: 'rgba(0, 56, 168, 0.2)', borderColor: 'rgba(0, 56, 168, 1)' }], // Dallas Cowboys - Navy Blue
    ['DEN', { backgroundColor: 'rgba(255, 56, 0, 0.2)', borderColor: 'rgba(255, 56, 0, 1)' }], // Denver Broncos - Orange
    ['DET', { backgroundColor: 'rgba(0, 56, 168, 0.2)', borderColor: 'rgba(0, 56, 168, 1)' }], // Detroit Lions - Blue
    ['GB', { backgroundColor: 'rgba(24, 45, 29, 0.2)', borderColor: 'rgba(24, 45, 29, 1)' }], // Green Bay Packers - Green
    ['HOU', { backgroundColor: 'rgba(0, 56, 78, 0.2)', borderColor: 'rgba(0, 56, 78, 1)' }], // Houston Texans - Navy Blue
    ['IND', { backgroundColor: 'rgba(0, 51, 153, 0.2)', borderColor: 'rgba(0, 51, 153, 1)' }], // Indianapolis Colts - Blue
    ['JAX', { backgroundColor: 'rgba(0, 93, 92, 0.2)', borderColor: 'rgba(0, 93, 92, 1)' }], // Jacksonville Jaguars - Teal
    ['KC', { backgroundColor: 'rgba(206, 17, 38, 0.2)', borderColor: 'rgba(206, 17, 38, 1)' }], // Kansas City Chiefs - Red
    ['LV', { backgroundColor: 'rgba(0, 0, 0, 0.2)', borderColor: 'rgba(0, 0, 0, 1)' }], // Las Vegas Raiders - Black
    ['LAC', { backgroundColor: 'rgba(0, 114, 206, 0.2)', borderColor: 'rgba(0, 114, 206, 1)' }], // Los Angeles Chargers - Blue
    ['LAR', { backgroundColor: 'rgba(0, 51, 204, 0.2)', borderColor: 'rgba(0, 51, 204, 1)' }], // Los Angeles Rams - Blue
    ['MIA', { backgroundColor: 'rgba(0, 183, 198, 0.2)', borderColor: 'rgba(0, 183, 198, 1)' }], // Miami Dolphins - Aqua
    ['MIN', { backgroundColor: 'rgba(85, 37, 130, 0.2)', borderColor: 'rgba(85, 37, 130, 1)' }], // Minnesota Vikings - Purple
    ['NE', { backgroundColor: 'rgba(0, 32, 91, 0.2)', borderColor: 'rgba(0, 32, 91, 1)' }], // New England Patriots - Navy Blue
    ['NO', { backgroundColor: 'rgba(0, 0, 0, 0.2)', borderColor: 'rgba(0, 0, 0, 1)' }], // New Orleans Saints - Black
    ['NYG', { backgroundColor: 'rgba(0, 56, 168, 0.2)', borderColor: 'rgba(0, 56, 168, 1)' }], // New York Giants - Blue
    ['NYJ', { backgroundColor: 'rgba(0, 56, 43, 0.2)', borderColor: 'rgba(0, 56, 43, 1)' }], // New York Jets - Green
    ['PHI', { backgroundColor: 'rgba(0, 56, 48, 0.2)', borderColor: 'rgba(0, 56, 48, 1)' }], // Philadelphia Eagles - Green
    ['PIT', { backgroundColor: 'rgba(255, 221, 51, 0.2)', borderColor: 'rgba(255, 221, 51, 1)' }], // Pittsburgh Steelers - Yellow
    ['SF', { backgroundColor: 'rgba(186, 12, 47, 0.2)', borderColor: 'rgba(186, 12, 47, 1)' }], // San Francisco 49ers - Red
    ['SEA', { backgroundColor: 'rgba(0, 35, 61, 0.2)', borderColor: 'rgba(0, 35, 61, 1)' }], // Seattle Seahawks - Navy Blue
    ['TB', { backgroundColor: 'rgba(186, 12, 47, 0.2)', borderColor: 'rgba(186, 12, 47, 1)' }], // Tampa Bay Buccaneers - Red
    ['TEN', { backgroundColor: 'rgba(0, 50, 89, 0.2)', borderColor: 'rgba(0, 50, 89, 1)' }], // Tennessee Titans - Navy Blue
    ['WAS', { backgroundColor: 'rgba(186, 12, 47, 0.2)', borderColor: 'rgba(186, 12, 47, 1)' }] // Washington Commanders - Burgundy
  ]);
  

  // User-selected values
  selectedYear = 2023;
  selectedWeek = 1;
  selectedPosition = 'QB';
  selectedStatistic = 'Fantasy Points';

  // Chart data
  chartData: any = null;
  isBrowser: boolean;

  constructor(
    private playerDataService: PlayerDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Fetch data initially based on default dropdown values
    if (this.isBrowser) {
      this.fetchPlayerData();
    }
  }

  onSelectionChange(): void {
    this.fetchPlayerData(); // Fetch new data based on dropdown selections
  }

  /**
   * Fetch player data from the service.
   */
  fetchPlayerData(): void {
    this.playerDataService.getPlayerData(this.statistic_map.get(this.selectedStatistic) ?? 'fantasy_points_ppr', this.selectedYear, this.selectedWeek, this.selectedPosition).subscribe(
      (data) => {
        this.updateChart(data); // Update chart data with the response
      },
      (error) => {
        console.error('Error fetching player data:', error);
      }
    );
  }

  /**
   * Update the chart with new data.
   * @param data API response data
   */
  updateChart(data: any[]): void {
    // Prepare the data for the chart
    this.chartData = {
      labels: data.map(player => player.player_name + ", " + player.team), // Player names
      datasets: [
        {
          label: this.selectedStatistic,
          data: data.map(player => player[this.statistic_map.get(this.selectedStatistic) ?? 'fantasy_points_ppr']), // Use data of selected stat
          backgroundColor: data.map(player => {
            const teamColors = this.nflTeamColors.get(player.team); // Get the color data for the team's abbreviation
            return teamColors ? teamColors.backgroundColor : 'rgba(75, 192, 192, 0.2)'; // Fallback to default color if no match
          }),
          borderColor: data.map(player => {
            const teamColors = this.nflTeamColors.get(player.team); // Get the color data for the team's abbreviation
            return teamColors ? teamColors.borderColor : 'rgba(75, 192, 192, 1)'; // Fallback to default color if no match
          }),
          borderWidth: 1
        }
      ],
    };
  }
}
