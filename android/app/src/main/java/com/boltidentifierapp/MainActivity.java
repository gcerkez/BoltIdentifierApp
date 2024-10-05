package com.boltidentifierapp;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import org.opencv.android.OpenCVLoader;

import java.util.Objects;

public class MainActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return "BoltIdentifierApp";
    }

    @Overriden
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(this, Objects.requireNonNull(getMainComponentName()), DefaultNewArchitectureEntryPoint.getFabricEnabled());
    }

    @Override
    protected void onResume() {
        super.onResume();
        System.loadLibrary("opencv_java4");
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);
    }
}
