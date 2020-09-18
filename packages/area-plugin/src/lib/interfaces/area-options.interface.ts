export interface AreaOptions {
  background?: false | string;
  snap?: false | SnapExtent;
  scaleExtent?: false | ScaleExtent;
  translateExtent?: false | TranslateExtent;
}

export interface TranslateExtent {
  width: number;
  height: number;
}

export interface ScaleExtent {
  min: number;
  max: number;
}

export interface SnapExtent {
  size: number;
  dynamic: boolean;
}
