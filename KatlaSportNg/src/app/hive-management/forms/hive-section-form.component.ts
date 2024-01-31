import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HiveSection } from '../models/hive-section';
import { HiveSectionService } from '../services/hive-section.service';
import { HiveListItem } from '../models/hive-list-item';
import { HiveService } from '../services/hive.service';
import { Hive } from '../models/hive';

@Component({
  selector: 'app-hive-section-form',
  templateUrl: './hive-section-form.component.html',
  styleUrls: ['./hive-section-form.component.css']
})
export class HiveSectionFormComponent implements OnInit {

  hiveSection = new HiveSection(0, "", "", 0, false, "");
  existed = false;
  hives: HiveListItem[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveSectionService: HiveSectionService,
    private hiveService: HiveService
  ) { }

  ngOnInit() {
    this.hiveService.getHives().subscribe(c => this.hives = c);
    this.route.params.subscribe(h => {
      if (h['id'] === undefined) return;
      this.hiveSectionService.getHiveSection(h['id']).subscribe(c => this.hiveSection = c);
      this.existed = true;
    });
}

  navigateToHiveSections() {
    if(this.hiveSection.storeHiveId){
      this.router.navigate([`/hive/${this.hiveSection.storeHiveId}/sections`]);
    } else {
      this.router.navigate([`/hives`]);
    }
    
  }

  onCancel() {
    this.navigateToHiveSections();
  }
  
  onSubmit() {
    if (this.existed) {
      this.hiveSectionService.updateHiveSection(this.hiveSection).subscribe(h => this.navigateToHiveSections());
    } else {
      this.hiveSectionService.addHiveSection(this.hiveSection).subscribe(h => this.navigateToHiveSections());
    }
  }

  onDelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, true).subscribe(h=> this.hiveSection.isDeleted = true);
  }

  onUndelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, false).subscribe(h => this.hiveSection.isDeleted = false);
  }

  onPurge() {
    this.hiveSectionService.deleteHiveSection(this.hiveSection.id).subscribe(h => this.navigateToHiveSections());
  }
}
